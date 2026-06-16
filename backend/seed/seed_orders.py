import json

from app import app
from database.db import db

from models.order import Order
from models.user import User

with app.app_context():

    Order.query.delete()

    with open(
        "data/orders.json",
        "r",
        encoding="utf-8"
    ) as f:

        orders = json.load(f)

    inserted = 0

    for o in orders:

        user = User.query.filter_by(
            user_code=o["user_id"]
        ).first()

        if not user:
            continue

        order = Order(

            order_code=o["order_id"],

            user_id=user.id,

            intent=o["intent"],

            budget_range=o["budget_range"],

            total_amount=o["total_amount"],

            order_status=o["order_status"],

            order_time=o["order_time"],

            delivery_time_minutes=o[
                "delivery_time_minutes"
            ],

            warehouse_id=o[
                "warehouse_id"
            ]
        )

        db.session.add(order)

        inserted += 1

    db.session.commit()

    print(
        f"Inserted {inserted} orders"
    )