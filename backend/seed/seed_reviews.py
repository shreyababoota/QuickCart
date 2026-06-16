import json

from app import app
from database.db import db

from models.review import Review
from models.user import User
from models.product import Product

with app.app_context():

    Review.query.delete()

    with open(
        "data/reviews.json",
        "r",
        encoding="utf-8"
    ) as f:

        reviews = json.load(f)

    inserted = 0

    for r in reviews:

        user = User.query.filter_by(
            user_code=r["user_id"]
        ).first()

        product = Product.query.filter_by(
            product_code=r["product_id"]
        ).first()

        if not user or not product:
            continue

        review = Review(

            review_code=r["review_id"],

            user_id=user.id,

            product_id=product.id,

            order_code=r["order_id"],

            rating=r["rating"],

            comment=r["comment"],

            sentiment=r["sentiment"],

            verified_purchase=r[
                "verified_purchase"
            ],

            review_date=r[
                "review_date"
            ]
        )

        db.session.add(review)

        inserted += 1

    db.session.commit()

    print(
        f"Inserted {inserted} reviews"
    )