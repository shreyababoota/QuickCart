import json

from app import app
from database.db import db

from models.product import Product

with app.app_context():

    Product.query.delete()

    with open(
        "data/products.json",
        "r",
        encoding="utf-8"
    ) as f:

        products = json.load(f)

    for p in products:

        product = Product(

            product_code=p["product_id"],

            name=p["name"],

            category=p["category"],

            subcategory=p["subcategory"],

            brand=p["brand"],

            price=p["price"],

            stock=p["stock"],

            tags=",".join(
                p["tags"]
            ),

            occasion=",".join(
                p["occasion"]
            ),

            time_affinity=",".join(
                p["time_affinity"]
            ),

            urgency_score=p["urgency_score"],

            frequently_bought_together=",".join(
                p["frequently_bought_together"]
            ),

            warehouse_inventory=json.dumps(
                p["warehouse_inventory"]
            ),

            expiry_date=p["expiry_date"],

            description=""
        )

        db.session.add(product)

    db.session.commit()

    print(
        f"Inserted {len(products)} products"
    )