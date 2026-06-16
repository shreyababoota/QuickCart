from app import app
from database.db import db
from models.missing_item import MissingItem

items = [
    {"goal_type": "trip", "item_name": "Sunscreen"},
    {"goal_type": "trip", "item_name": "Sunglasses"},
    {"goal_type": "trip", "item_name": "Power Bank"},
    {"goal_type": "trip", "item_name": "Charger"},
    {"goal_type": "trip", "item_name": "Medicines"},
    {"goal_type": "trip", "item_name": "ID Proof"},
    {"goal_type": "trip", "item_name": "Umbrella"},
    {"goal_type": "trip", "item_name": "Travel Bag"},
    {"goal_type": "gym", "item_name": "Dumbbells"},
    {"goal_type": "gym", "item_name": "Resistance Bands"},
    {"goal_type": "gym", "item_name": "Yoga Mat"},
    {"goal_type": "gym", "item_name": "Water Bottle"},
    {"goal_type": "gym", "item_name": "Protein"},
    {"goal_type": "semester", "item_name": "Laptop"},
    {"goal_type": "semester", "item_name": "Notebook"},
    {"goal_type": "semester", "item_name": "Backpack"},
    {"goal_type": "semester", "item_name": "Extension Cord"},
    {"goal_type": "semester", "item_name": "Desk Lamp"},
    {"goal_type": "weight_loss", "item_name": "Water Bottle"},
    {"goal_type": "weight_loss", "item_name": "Protein"},
    {"goal_type": "weight_loss", "item_name": "Healthy Snacks"},
    {"goal_type": "weight_loss", "item_name": "Shaker Bottle"},
    {"goal_type": "general", "item_name": "Charger"},
    {"goal_type": "general", "item_name": "Power Bank"},
]

with app.app_context():
    MissingItem.query.delete()
    for item in items:
        db.session.add(MissingItem(goal_type=item["goal_type"], item_name=item["item_name"]))
    db.session.commit()
    print("Missing items inserted")
