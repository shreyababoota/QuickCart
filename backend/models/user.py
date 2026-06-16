from database.db import db


class User(db.Model):
    __tablename__ = "users"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    city = db.Column(db.String(100))
    persona = db.Column(db.String(100))
    preferences = db.Column(db.Text)
    favorite_categories = db.Column(db.Text)
    primary_intent = db.Column(db.String(100))
    loyalty_tier = db.Column(db.String(50))
    total_orders = db.Column(db.Integer, default=0)
    recent_intents = db.Column(db.Text)
    avg_order_value = db.Column(db.Float)
    signup_date = db.Column(db.String(50))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    user_code = db.Column(db.String(20), unique=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "persona": self.persona,
        }
