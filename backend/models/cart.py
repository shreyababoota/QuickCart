from database.db import db


class Cart(db.Model):
    __tablename__ = "carts"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    # Neon FK: carts.user_id → users.id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)


class CartItem(db.Model):
    __tablename__ = "cart_items"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    # Neon FKs: cart_items.cart_id → carts.id, .goal_id → goals.id, .product_id → products.id
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"), nullable=False)
    goal_id = db.Column(db.Integer, db.ForeignKey("goals.id"), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)

    quantity = db.Column(db.Integer, default=1)
