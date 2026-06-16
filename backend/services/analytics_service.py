from datetime import datetime, timedelta

from models.user import User
from models.product import Product
from models.order import Order
from models.review import Review
from models.goal import Goal
from models.interaction import Interaction


def get_analytics():
    total_users = User.query.count()
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_reviews = Review.query.count()
    total_goals = Goal.query.count()

    cart_adds = Interaction.query.filter_by(action="cart_add").count()
    cart_removes = Interaction.query.filter_by(action="cart_remove").count()

    thirty_days_ago = (datetime.utcnow() - timedelta(days=30)).isoformat()
    active_users = (
        Interaction.query.filter(Interaction.timestamp >= thirty_days_ago)
        .with_entities(Interaction.user_id)
        .distinct()
        .count()
    )

    revenue = (
        Order.query.with_entities(Order.total_amount)
        .filter(Order.total_amount.isnot(None))
        .all()
    )
    total_revenue = sum(r[0] for r in revenue if r[0])

    return {
        "users": total_users,
        "active_users": active_users or total_users,
        "products": total_products,
        "orders": total_orders,
        "reviews": total_reviews,
        "goals_created": total_goals,
        "cart_adds": cart_adds,
        "cart_removes": cart_removes,
        "revenue": round(total_revenue, 2),
        "interactions": Interaction.query.count(),
    }
