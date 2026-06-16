from database.db import db
from datetime import datetime


class Goal(db.Model):
    __tablename__ = "goals"

    # Neon PK column is "id"
    id = db.Column(db.Integer, primary_key=True)

    # Neon FK: goals.user_id → users.id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    goal_text = db.Column(db.Text, nullable=False)
    budget = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "goal_text": self.goal_text,
            "budget": self.budget,
            "created_at": self.created_at,
        }
