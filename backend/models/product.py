from database.db import db

class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    product_code = db.Column(
        db.String(20),
        unique=True
    )

    name = db.Column(
        db.String(255),
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    subcategory = db.Column(
        db.String(100)
    )

    brand = db.Column(
        db.String(100)
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    stock = db.Column(
        db.Integer,
        default=0
    )

    tags = db.Column(
        db.Text
    )

    occasion = db.Column(
        db.Text
    )

    time_affinity = db.Column(
        db.Text
    )

    urgency_score = db.Column(
        db.Float,
        default=0
    )

    description = db.Column(
        db.Text
    )

    frequently_bought_together = db.Column(
        db.Text
    )

    warehouse_inventory = db.Column(
        db.Text
    )

    expiry_date = db.Column(
        db.String(50)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "product_code": self.product_code,
            "name": self.name,
            "category": self.category,
            "subcategory": self.subcategory,
            "brand": self.brand,
            "price": self.price,
            "stock": self.stock,
            "urgency_score": self.urgency_score,
            "description": self.description
        }