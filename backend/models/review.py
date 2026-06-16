from database.db import db


class Review(db.Model):
    __tablename__ = "reviews"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    review_code = db.Column(db.String(20), unique=True)

    # Neon FKs: reviews.product_id → products.id, reviews.user_id → users.id
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    order_code = db.Column(db.String(20))
    rating = db.Column(db.Float)
    comment = db.Column(db.Text)
    sentiment = db.Column(db.String(50))
    verified_purchase = db.Column(db.Boolean)
    review_date = db.Column(db.String(50))
