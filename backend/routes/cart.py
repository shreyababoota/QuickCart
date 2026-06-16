from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.goal import Goal
from models.product import Product
from database.db import db
from models.cart import Cart, CartItem
from services.budget_service import budget_status, savings_suggestions
from services.assistant_service import log_interaction
from services.inventory_service import enrich_product_dict

cart_bp = Blueprint("cart", __name__)


@cart_bp.route("/", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return {"cart": [], "suggestions": []}

    items = CartItem.query.filter_by(cart_id=cart.id).all()
    cart_products = []
    suggestions = []

    for item in items:
        product = Product.query.get(item.product_id)
        if product:
            pdata = product.to_dict()
            pdata["goal_id"] = item.goal_id
            cart_products.append(pdata)

    return {"cart": cart_products, "suggestions": suggestions}


@cart_bp.route("/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = request.json or {}

    print("RAW REQUEST:", data)

    goal_id = data.get("goal_id")
    product_id = data.get("product_id")

    print("PRODUCT ID RECEIVED:", product_id)

    if goal_id in [None, "null", "None", "general", 0, "0"]:
        goal_id = None
    else:
        try:
            goal_id = int(goal_id)
        except (TypeError, ValueError):
            return {"message": "Invalid goal_id"}, 400

    if not product_id:
        return {"message": "Invalid product_id"}, 400

    # Support both numeric id and string product_code (e.g. "P0083")
    product = None
    try:
        numeric_id = int(product_id)
        product = Product.query.get(numeric_id)
    except (TypeError, ValueError):
        # product_id is not numeric — try looking up by product_code
        import re
        product = Product.query.filter_by(product_code=str(product_id)).first()
        # Try case-insensitive
        if not product:
            product = Product.query.filter(
                Product.product_code.ilike(str(product_id))
            ).first()
        # Try normalized code (P0001 → p001)
        if not product:
            num_match = re.match(r'[Pp]0*(\d+)', str(product_id))
            if num_match:
                num = int(num_match.group(1))
                for variant in [f"p{num:03d}", f"p{num:04d}", f"p{num}"]:
                    product = Product.query.filter(
                        Product.product_code.ilike(variant)
                    ).first()
                    if product:
                        break

    if not product:
        return {"message": "Product not found"}, 404

    # Always use the numeric primary key for cart storage
    product_id = product.id

    if goal_id is not None:
        goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
        if not goal:
            return {"message": "Invalid goal_id"}, 400

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    existing_item = CartItem.query.filter_by(
        cart_id=cart.id, goal_id=goal_id, product_id=product_id
    ).first()

    if existing_item:
        return {"message": "Already in cart"}, 409

    cart_item = CartItem(cart_id=cart.id, goal_id=goal_id, product_id=product_id)
    db.session.add(cart_item)
    db.session.commit()

    try:
        log_interaction(user_id, product_id, "cart_add")
    except Exception:
        db.session.rollback()

    return {"message": "Added to cart"}


@cart_bp.route("/remove", methods=["POST"])
@jwt_required()
def remove_from_cart():
    user_id = int(get_jwt_identity())
    data = request.json or {}
    goal_id = data.get("goal_id")
    product_id = data.get("product_id")

    if product_id is None:
        return {"message": "Invalid product_id"}, 400

    if goal_id in [None, "null", "None", "general", 0, "0"]:
        goal_id = None
    elif goal_id is not None:
        try:
            goal_id = int(goal_id)
        except (TypeError, ValueError):
            return {"message": "Invalid goal_id"}, 400

    try:
        product_id = int(product_id)
    except (TypeError, ValueError):
        # Support product_code strings (e.g. "P0083") for removal as well
        product = Product.query.filter_by(product_code=str(product_id)).first()
        if not product:
            return {"message": "Invalid product_id"}, 400
        product_id = product.id

    cart = Cart.query.filter_by(user_id=user_id).first()
    if not cart:
        return {"message": "Cart not found"}, 404

    item = CartItem.query.filter_by(
        cart_id=cart.id, goal_id=goal_id, product_id=product_id
    ).first()

    if not item:
        return {"message": "Item not found"}, 404

    db.session.delete(item)
    db.session.commit()

    try:
        log_interaction(user_id, product_id, "cart_remove")
    except Exception:
        pass

    return {"message": "Removed successfully"}


@cart_bp.route("/grouped", methods=["GET"])
@jwt_required()
def grouped_cart():
    user_id = int(get_jwt_identity())
    all_products = Product.query.all()
    goals = Goal.query.filter_by(user_id=user_id).all()
    cart = Cart.query.filter_by(user_id=user_id).first()
    result = []

    for goal in goals:
        if cart:
            items = CartItem.query.filter_by(
                cart_id=cart.id, goal_id=goal.id
            ).all()
        else:
            items = []
        products = []
        total = 0

        for item in items:
            product = Product.query.get(item.product_id)
            if product:
                pdata = product.to_dict()
                total += pdata["price"]
                products.append(pdata)

        budget = goal.budget or 0
        status_color, status_label = budget_status(budget, total)
        suggestions = savings_suggestions(
            [Product.query.get(i.product_id) for i in items if Product.query.get(i.product_id)],
            all_products,
            total,
            budget,
        )

        result.append({
            "goal_id": goal.id,
            "goal": goal.goal_text,
            "budget": budget,
            "spent": total,
            "remaining": (budget or 0) - total,
            "budget_status": status_color,
            "budget_status_label": status_label,
            "savings_suggestions": suggestions,
            "products": products,
        })

    if cart:
        general_items = CartItem.query.filter_by(cart_id=cart.id, goal_id=None).all()
        if general_items:
            general_products = []
            general_total = 0
            for item in general_items:
                product = Product.query.get(item.product_id)
                if product:
                    pdata = product.to_dict()
                    general_total += pdata["price"]
                    general_products.append(pdata)

            if general_products:
                result.append({
                    "goal_id": None,
                    "goal": "General Cart",
                    "budget": 0,
                    "spent": general_total,
                    "remaining": 0,
                    "budget_status": "green",
                    "budget_status_label": "Within Budget",
                    "savings_suggestions": [],
                    "products": general_products,
                })

    return result
