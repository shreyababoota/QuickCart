"""
routes/recommend.py
-------------------
Recommendation endpoints.

Flow for every endpoint:
  1. Try ML service (Railway DB, read-only)       → returns product_ids
  2. Resolve product_ids against Neon DB           → returns full Product objects
  3. If ML service is unavailable → fall back to local keyword scoring (unchanged)

JWT auth is NOT required here (same as before).
"""

from flask import Blueprint, request

from models.product import Product
from models.user import User
from services.recommendation_engine import (
    get_recommendations,
    get_personalized_recommendations,
    detect_goal_category,
)
from services.ml_client import (
    get_ml_recommendations,
    get_ml_personalized,
    get_ml_near_expiry,
    health_check,
)
from services.inventory_service import days_until_expiry, auto_discount_percent

recommend_bp = Blueprint("recommend", __name__)


# ---------------------------------------------------------------------------
# Helper: resolve a list of product_ids from ML → Neon Product objects
# ---------------------------------------------------------------------------

def _resolve_products(product_ids: list[int], limit: int) -> list:
    """
    Given a list of product_ids returned by the ML service,
    fetch the matching rows from Neon and preserve the ML ranking order.
    Unknown IDs are silently skipped.
    """
    if not product_ids:
        return []

    # Bulk fetch — one DB query
    rows = Product.query.filter(
        Product.product_id.in_(product_ids)
    ).all()
    row_map = {p.product_id: p for p in rows}

    # Preserve ML ranking order
    ordered = [row_map[pid] for pid in product_ids if pid in row_map]
    return ordered[:limit]


# ---------------------------------------------------------------------------
# POST /api/recommend/
# ---------------------------------------------------------------------------

@recommend_bp.route("/", methods=["POST"])
def recommend():
    data = request.json or {}
    user_id = data.get("user_id")
    goal = data.get("goal", "")
    limit = int(data.get("limit", 10))

    user = None

    products, goal_category = get_recommendations(
        goal,
        user,
        limit=limit
    )

    return {
        "source": "local",
        "goal_category": goal_category,
        "recommended_products": [p.to_dict() for p in products],
    }
# ---------------------------------------------------------------------------
# POST /api/recommend/personalized
# ---------------------------------------------------------------------------

@recommend_bp.route("/personalized", methods=["POST"])
def personalized():
    data = request.json or {}
    user_id = data.get("user_id")
    limit = int(data.get("limit", 10))

    user = User.query.get(user_id) if user_id else None

    products = get_personalized_recommendations(
        user,
        limit=limit
    )

    return {
        "source": "local",
        "recommended_products": [p.to_dict() for p in products],
    }
# ---------------------------------------------------------------------------
# POST /api/recommend/near-expiry
# ---------------------------------------------------------------------------

@recommend_bp.route("/near-expiry", methods=["POST"])
def near_expiry_for_user():
    data = request.json or {}
    goal_text = data.get("goal", "")
    limit = int(data.get("limit", 5))

    # --- Try ML service first ---
    ml_ids = get_ml_near_expiry(goal=goal_text, limit=limit)

    if ml_ids is not None:
        products = _resolve_products(ml_ids, limit)
        if products:
            return {
                "source": "ml",
                "products": [p.to_dict() for p in products],
            }

    # --- Fallback: local near-expiry logic (unchanged from original) ---
    category = detect_goal_category(goal_text)
    all_products = Product.query.all()
    matched = []

    for product in all_products:
        days = days_until_expiry(product.expiry_date)
        if days is None or days < 0 or days > 7:
            continue

        score = 0
        hay = f"{product.name} {product.tags or ''} {product.category or ''}".lower()
        if category == "weight_loss" and any(w in hay for w in ["protein", "healthy", "snack"]):
            score += 5
        if category == "trip" and any(w in hay for w in ["travel", "snack", "medicine"]):
            score += 3

        discount = auto_discount_percent(days)
        if discount > 0:
            matched.append({"score": score + discount, "product": product.to_dict()})

    matched.sort(key=lambda x: x["score"], reverse=True)
    return {
        "source": "local",
        "products": [m["product"] for m in matched[:limit]],
    }


# ---------------------------------------------------------------------------
# GET /api/recommend/health
# New endpoint — lets the frontend / ops check ML service status
# ---------------------------------------------------------------------------

@recommend_bp.route("/health", methods=["GET"])
def ml_health():
    alive = health_check()
    return {
        "ml_service": "up" if alive else "down",
        "ml_url": __import__("os").getenv("ML_SERVICE_URL", "not set"),
    }, 200
