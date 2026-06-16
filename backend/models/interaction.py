from database.db import db


class Interaction(db.Model):
    __tablename__ = "interactions"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    interaction_code = db.Column(db.String(20), unique=True)

    # Neon FKs: interactions.user_id → users.id, interactions.product_id → products.id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))

    action = db.Column(db.String(50))

    # Neon column is "timestamp" (not "interaction_time")
    timestamp = db.Column(db.String(50))
