import json

from app import app
from database.db import db

from models.interaction import Interaction
from models.user import User
from models.product import Product

with app.app_context():

    Interaction.query.delete()

    with open(
        "data/interactions.json",
        "r",
        encoding="utf-8"
    ) as f:

        interactions = json.load(f)

    inserted = 0

    for i in interactions:

        user = User.query.filter_by(
            user_code=i["user_id"]
        ).first()

        product = Product.query.filter_by(
            product_code=i["product_id"]
        ).first()

        if not user or not product:
            continue

        interaction = Interaction(

            interaction_code=i[
                "interaction_id"
            ],

            user_id=user.id,

            product_id=product.id,

            action=i["action"],

            timestamp=i[
                "timestamp"
            ]
        )

        db.session.add(
            interaction
        )

        inserted += 1

    db.session.commit()

    print(
        f"Inserted {inserted} interactions"
    )