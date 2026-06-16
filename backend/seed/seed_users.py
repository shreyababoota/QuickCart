import json

from app import app
from database.db import db

from models.user import User

with app.app_context():

    User.query.delete()

    with open(
        "data/users.json",
        "r",
        encoding="utf-8"
    ) as f:

        users = json.load(f)

    for u in users:

        user = User(
            user_code=u["user_id"],
            name=u["name"],

            email=f'{u["user_id"]}@demo.com',

            password="demo123",

            age=u["age"],

            city=u["city"],

            persona=u["persona"],

            preferences=",".join(
                u["preferences"]
            ),

            favorite_categories=",".join(
                u["favorite_categories"]
            ),

            primary_intent=u["primary_intent"],

            recent_intents=",".join(
                u["recent_intents"]
            ),

            avg_order_value=u["avg_order_value"],

            signup_date=u["signup_date"],

            loyalty_tier=u["loyalty_tier"],

            total_orders=u["total_orders"],

            lat=u["lat"],

            lon=u["lon"]
        )

        db.session.add(user)

    db.session.commit()

    print(
        f"Inserted {len(users)} users"
    )