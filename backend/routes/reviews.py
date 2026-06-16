from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from models.review import Review
from models.product import Product
from services.review_service import summarize_reviews

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.route("/product/<int:product_id>", methods=["GET"])
def product_reviews(product_id):
    product = Product.query.get(product_id)
    if not product:
        return {"error": "Product not found"}, 404

    reviews = Review.query.filter_by(product_id=product_id).all()
    summary = summarize_reviews(reviews)

    return {
        "product_id": product_id,
        "product_name": product.name,
        **summary,
        "reviews": [
            {
                "rating": r.rating,
                "comment": r.comment,
                "sentiment": r.sentiment,
                "review_date": r.review_date,
                "verified_purchase": r.verified_purchase,
            }
            for r in reviews[:20]
        ],
    }


@reviews_bp.route("/product/code/<product_code>", methods=["GET"])
def product_reviews_by_code(product_code):
    product = Product.query.filter_by(product_code=product_code).first()
    if not product:
        try:
            product = Product.query.get(int(product_code))
        except (TypeError, ValueError):
            pass
    if not product:
        return {"error": "Product not found"}, 404
    return product_reviews(product.id)
