from flask import Blueprint
from flask_jwt_extended import jwt_required

from models.user import User
from models.goal import Goal
from models.order import Order
from models.product import Product
from services.inventory_service import days_until_expiry, expiry_label, auto_discount_percent
from services.sustainability_service import get_sustainability_metrics
from services.analytics_service import get_analytics

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/customers", methods=["GET"])
@jwt_required()
def admin_customers():
    users = User.query.all()
    result = []

    for user in users:
        orders = Order.query.filter_by(user_id=user.id).all()
        goals = Goal.query.filter_by(user_id=user.id).all()
        spent = sum(o.total_amount or 0 for o in orders)

        result.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.city or "—",
            "orders": len(orders),
            "goals": len(goals),
            "spent": round(spent, 2),
            "persona": user.persona,
            "loyalty_tier": user.loyalty_tier,
        })

    return result


@admin_bp.route("/inventory", methods=["GET"])
@jwt_required()
def admin_inventory():
    products = Product.query.all()
    result = []

    for product in products:
        days = days_until_expiry(product.expiry_date)
        discount = auto_discount_percent(days)
        label = expiry_label(days)

        result.append({
            **product.to_dict(include_inventory=True),
            "expiry_label": label,
            "auto_discount_percent": discount,
            "low_stock": (product.stock or 0) < 30,
        })

    return result


@admin_bp.route("/orders", methods=["GET"])
@jwt_required()
def admin_orders():
    orders = Order.query.order_by(Order.id.desc()).all()
    result = []

    for order in orders:
        user = User.query.get(order.user_id)
        result.append({
            "id": order.order_code or f"ORD-{order.id}",
            "customer": user.name if user else "Unknown",
            "date": order.order_time,
            "total": order.total_amount or 0,
            "status": order.order_status,
            "revenue": order.total_amount or 0,
            "intent": order.intent,
        })

    return result


@admin_bp.route("/sustainability", methods=["GET"])
@jwt_required()
def admin_sustainability():
    return get_sustainability_metrics()


@admin_bp.route("/analytics", methods=["GET"])
@jwt_required()
def admin_analytics():
    return get_analytics()
