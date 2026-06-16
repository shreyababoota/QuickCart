from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from database.db import db
from models.cart import CartItem
from models.goal import Goal
from services.budget_service import budget_status

goal_bp = Blueprint("goal", __name__)


@goal_bp.route("/create", methods=["POST"])
@jwt_required()
def create_goal():
    user_id = get_jwt_identity()
    data = request.json or {}

    goal_text = data.get("goal")
    budget = data.get("budget")

    if not goal_text:
        return {"message": "Goal text is required"}, 400

    goal = Goal(user_id=user_id, goal_text=goal_text, budget=budget)
    db.session.add(goal)
    db.session.commit()

    return {"message": "Goal created successfully", "goal": goal.to_dict()}


@goal_bp.route("/", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = int(get_jwt_identity())
    goals = Goal.query.filter_by(user_id=user_id).all()
    return [goal.to_dict() for goal in goals]


@goal_bp.route("/<int:goal_id>", methods=["PATCH"])
@jwt_required()
def update_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()

    if not goal:
        return {"message": "Goal not found"}, 404

    data = request.json or {}
    if "goal_text" in data:
        goal.goal_text = data["goal_text"]
    if "budget" in data:
        goal.budget = data["budget"]

    db.session.commit()
    return {"message": "Goal updated", "goal": goal.to_dict()}


@goal_bp.route("/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    print("Deleting goal:", goal_id)

    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        goal = Goal.query.filter_by(id=goal_id).first()
        if goal is None:
            return {"message": "Goal not found"}, 404
        return {"message": "Forbidden"}, 403

    try:
        CartItem.query.filter_by(goal_id=goal_id).delete(synchronize_session=False)
        db.session.delete(goal)
        db.session.commit()
        print("Goal deleted successfully", goal_id)
        return {"message": "Goal deleted successfully"}, 200
    except Exception:
        db.session.rollback()
        print("Failed to delete goal", goal_id)
        return {"message": "Failed to delete goal"}, 500


@goal_bp.route("/delete", methods=["POST"])
@jwt_required()
def delete_goal_post():
    user_id = int(get_jwt_identity())
    data = request.json or {}
    goal_id = data.get("goal_id")

    if goal_id in (None, ""):
        return {"message": "Goal id is required"}, 400

    try:
        goal_id = int(goal_id)
    except (TypeError, ValueError):
        return {"message": "Invalid goal id"}, 400

    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        goal = Goal.query.filter_by(id=goal_id).first()
        if goal is None:
            return {"message": "Goal not found"}, 404
        return {"message": "Forbidden"}, 403

    try:
        CartItem.query.filter_by(goal_id=goal_id).delete(synchronize_session=False)
        db.session.delete(goal)
        db.session.commit()
        print("Goal deleted successfully", goal_id)
        return {"message": "Goal deleted successfully"}, 200
    except Exception:
        db.session.rollback()
        print("Failed to delete goal", goal_id)
        return {"message": "Failed to delete goal"}, 500


@goal_bp.route("/<int:goal_id>/budget", methods=["GET"])
@jwt_required()
def goal_budget(goal_id):
    from models.cart import CartItem
    from models.product import Product
    from services.budget_service import savings_suggestions

    user_id = int(get_jwt_identity())
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()

    if not goal:
        return {"message": "Goal not found"}, 404

    items = CartItem.query.filter_by(goal_id=goal_id).all()
    products = []
    total = 0

    for item in items:
        product = Product.query.get(item.product_id)
        if product:
            products.append(product)
            total += product.price

    budget = goal.budget or 0
    status_color, status_label = budget_status(budget, total)
    suggestions = savings_suggestions(products, Product.query.all(), total, budget)

    return {
        "goal_id": goal.id,
        "budget": budget,
        "spent": total,
        "remaining": budget - total,
        "budget_status": status_color,
        "budget_status_label": status_label,
        "savings_suggestions": suggestions,
    }
