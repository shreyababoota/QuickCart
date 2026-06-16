from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

from database.db import db
from models.order import Order
from models.user import User
from models.review import Review
from models.cart import Cart, CartItem
from models.product import Product
from models.goal import Goal

orders_bp = Blueprint("orders", __name__)


def order_to_dict(order, include_reviews=False):
    user = User.query.get(order.user_id)
    data = {
        "id": order.order_code or f"ORD-{order.id}",
        "order_id": order.id,
        "user_id": order.user_id,
        "customer": user.name if user else "Unknown",
        "date": order.order_time or "",
        "total": order.total_amount or 0,
        "status": order.order_status or "pending",
        "intent": order.intent or "",
        "budget_range": order.budget_range or "",
    }

    if include_reviews:
        reviews = Review.query.filter_by(order_code=order.order_code).all()
        data["reviews"] = [
            {
                "rating": r.rating,
                "comment": r.comment,
                "review_date": r.review_date,
            }
            for r in reviews
        ]

    return data


@orders_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_orders():
    user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.id.desc()).all()

    result = []
    for order in orders:
        od = order_to_dict(order, include_reviews=True)
        reviews = Review.query.filter_by(order_code=order.order_code).all()
        od["rating"] = round(sum(r.rating for r in reviews if r.rating) / len(reviews), 1) if reviews else None
        od["review"] = reviews[0].comment if reviews else None
        od["purchase_date"] = order.order_time
        od["items"] = []
        result.append(od)

    return result


@orders_bp.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():
    user_id = int(get_jwt_identity())
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return {"error": "Cart is empty"}, 400

    items = CartItem.query.filter_by(cart_id=cart.id).all()
    if not items:
        return {"error": "Cart is empty"}, 400

    total = 0
    intent_parts = []
    for item in items:
        product = Product.query.get(item.product_id)
        if product:
            total += product.price
        if item.goal_id:
            goal = Goal.query.get(item.goal_id)
            if goal:
                intent_parts.append(goal.goal_text)

    order_code = f"ORD-{user_id}-{int(datetime.utcnow().timestamp())}"[:20]
    order = Order(
        order_code=order_code,
        user_id=user_id,
        intent=", ".join(set(intent_parts))[:100] if intent_parts else "general",
        budget_range="",
        total_amount=round(total, 2),
        order_status="confirmed",
        order_time=datetime.utcnow().strftime("%Y-%m-%d"),
        delivery_time_minutes=120,
    )
    db.session.add(order)

    for item in items:
        db.session.delete(item)

    user = User.query.get(user_id)
    if user:
        user.total_orders = (user.total_orders or 0) + 1

    db.session.commit()

    return {
        "message": "Order placed successfully",
        "order": order_to_dict(order),
    }


@orders_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_orders():
    orders = Order.query.order_by(Order.id.desc()).all()
    return [order_to_dict(o) for o in orders]
