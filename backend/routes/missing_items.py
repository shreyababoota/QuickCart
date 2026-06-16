from flask import Blueprint
from flask_jwt_extended import jwt_required

from models.cart import CartItem
from models.product import Product
from models.goal import Goal
from models.missing_item import MissingItem
from services.goal_classifier import detect_goal_type

missing_bp = Blueprint("missing", __name__)


def find_product_for_label(label, products):
    label_lower = label.lower()
    keywords = [w for w in label_lower.split() if len(w) > 2]

    for product in products:
        hay = f"{product.name} {product.tags or ''} {product.category or ''}".lower()
        if label_lower in hay or all(k in hay for k in keywords if keywords):
            return product
        for kw in keywords:
            if kw in hay:
                return product
    return None


@missing_bp.route("/<int:goal_id>")
@jwt_required()
def get_missing_items(goal_id):
    goal = Goal.query.get(goal_id)
    if not goal:
        return {"error": "Goal not found"}, 404

    goal_type = detect_goal_type(goal.goal_text)
    expected_items = MissingItem.query.filter_by(goal_type=goal_type).all()
    all_products = Product.query.all()

    cart_items = CartItem.query.filter_by(goal_id=goal_id).all()
    existing_names = set()

    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            existing_names.add(product.name.lower())
            hay = f"{product.name} {product.tags or ''}".lower()
            existing_names.add(hay)

    missing = []
    missing_products = []

    for item in expected_items:
        name = item.item_name
        name_lower = name.lower()
        found_in_cart = any(
            name_lower in existing or existing in name_lower
            for existing in existing_names
        )
        if not found_in_cart:
            missing.append(name)
            product = find_product_for_label(name, all_products)
            if product:
                missing_products.append(product.to_dict())
            else:
                missing_products.append({
                    "id": None,
                    "name": name,
                    "is_label_only": True,
                })

    return {
        "goal": goal.goal_text,
        "missing_items": missing,
        "missing_products": missing_products,
    }
