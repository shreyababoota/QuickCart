from database.db import db


class Order(db.Model):
    __tablename__ = "orders"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    order_code = db.Column(db.String(20), unique=True)

    # Neon FK: orders.user_id → users.id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    intent = db.Column(db.String(100))
    budget_range = db.Column(db.String(100))
    total_amount = db.Column(db.Float)
    order_status = db.Column(db.String(50))
    order_time = db.Column(db.String(50))
    delivery_time_minutes = db.Column(db.Integer)
    warehouse_id = db.Column(db.String(20))
