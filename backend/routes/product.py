from flask import Blueprint
from models.product import Product

product_bp = Blueprint(
    "products",
    __name__
)

@product_bp.route("/", methods=["GET"])
def get_products():

    products = Product.query.all()

    return [
        product.to_dict()
        for product in products
    ]

@product_bp.route("/<product_code>", methods=["GET"])
def get_product(product_code):
    import re

    # Try exact match first
    product = Product.query.filter_by(
        product_code=product_code
    ).first()

    # Try case-insensitive match
    if not product:
        product = Product.query.filter(
            Product.product_code.ilike(product_code)
        ).first()

    # Try normalized code (P0001 → p001, P0083 → p083)
    if not product:
        num_match = re.match(r'[Pp]0*(\d+)', product_code)
        if num_match:
            num = int(num_match.group(1))
            variants = [
                f"p{num:03d}",   # p001
                f"p{num:04d}",   # p0001
                f"p{num}",       # p1
                f"P{num:03d}",   # P001
                f"P{num:04d}",   # P0001
            ]
            for variant in variants:
                product = Product.query.filter(
                    Product.product_code.ilike(variant)
                ).first()
                if product:
                    break

    # Try numeric ID lookup as last resort
    if not product:
        try:
            numeric_id = int(product_code)
            product = Product.query.get(numeric_id)
        except (TypeError, ValueError):
            pass

    if not product:
        return {
            "message": "Product not found"
        }, 404

    return product.to_dict()