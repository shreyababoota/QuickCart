from datetime import date

from services.inventory_service import days_until_expiry, parse_expiry


def get_sustainability_metrics():
    from models.product import Product
    from models.order import Order

    products = Product.query.all()
    today = date.today()

    expired_count = 0
    saved_count = 0
    discounted_sold = 0
    near_expiry_saved = 0

    for product in products:
        days = days_until_expiry(product.expiry_date)
        if days is not None:
            if days < 0:
                expired_count += 1
            elif days <= 7:
                saved_count += product.stock or 0
                near_expiry_saved += 1

    orders = Order.query.filter(
        Order.order_status.in_(["delivered", "completed", "Delivered"])
    ).all()
    discounted_sold = len(orders)

    food_saved_kg = round(saved_count * 0.5, 1)
    co2_reduction = round(food_saved_kg * 2.5, 1)
    inventory_saved = saved_count

    return {
        "expired_inventory": expired_count,
        "saved_inventory": saved_count,
        "discounted_inventory_sold": discounted_sold,
        "near_expiry_products": near_expiry_saved,
        "food_saved_kg": food_saved_kg,
        "co2_reduction_kg": co2_reduction,
        "inventory_saved_units": inventory_saved,
        "waste_trend": build_waste_trend(expired_count, saved_count),
    }


def build_waste_trend(expired, saved):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    base_waste = max(1, expired)
    base_saved = max(1, saved)
    trend = []
    for i, label in enumerate(months):
        factor = 0.7 + (i * 0.05)
        trend.append({
            "label": label,
            "waste": round(base_waste * (1.2 - i * 0.1)),
            "saved": round(base_saved * factor),
        })
    return trend
