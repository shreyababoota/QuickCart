from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from database.db import db

from models.user import User
from models.goal import Goal
from models.product import Product
from models.cart import Cart
from models.cart import CartItem
from models.missing_item import MissingItem
from models.order import Order
from models.review import Review
from models.interaction import Interaction

from routes.auth import auth_bp
from routes.goal import goal_bp
from routes.product import product_bp
from routes.cart import cart_bp
from routes.stats import stats_bp
from routes.missing_items import missing_bp
from routes.recommend import recommend_bp
from routes.assistant import assistant_bp
from routes.orders import orders_bp
from routes.reviews import reviews_bp
from routes.admin import admin_bp

app = Flask(__name__)

app.config.from_object(Config)

CORS(app)

db.init_app(app)

jwt = JWTManager(app)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {"message": "Token has expired", "error": "token_expired"}, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {"message": "Invalid token", "error": "invalid_token"}, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return {"message": "Authorization token required", "error": "authorization_required"}, 401

@app.route("/")
def home():
    return {
        "message": "SmartShop Backend Running"
    }

app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    missing_bp,
    url_prefix="/api/missing"
)

app.register_blueprint(
    cart_bp,
    url_prefix="/api/cart"
)

app.register_blueprint(
    stats_bp,
    url_prefix="/api/stats"
)

app.register_blueprint(
    goal_bp,
    url_prefix="/api/goals"
)

app.register_blueprint(
    recommend_bp,
    url_prefix="/api/recommend"
)

app.register_blueprint(
    product_bp,
    url_prefix="/api/products"
)

app.register_blueprint(
    assistant_bp,
    url_prefix="/api/assistant"
)

app.register_blueprint(
    orders_bp,
    url_prefix="/api/orders"
)

app.register_blueprint(
    reviews_bp,
    url_prefix="/api/reviews"
)

app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)