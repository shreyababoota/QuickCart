from database.db import db

class MissingItem(db.Model):

    __tablename__ = "missing_items"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    goal_type = db.Column(
        db.String(100),
        nullable=False
    )

    item_name = db.Column(
        db.String(255),
        nullable=False
    )
