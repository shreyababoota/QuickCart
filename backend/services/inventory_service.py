from datetime import datetime, date


def parse_expiry(expiry_str):
    if not expiry_str:
        return None
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(expiry_str.strip(), fmt).date()
        except ValueError:
            continue
    return None


def days_until_expiry(expiry_str):
    expiry = parse_expiry(expiry_str)
    if not expiry:
        return None
    return (expiry - date.today()).days


def expiry_label(days_left):
    if days_left is None:
        return None
    if days_left <= 0:
        return "Expired"
    if days_left == 1:
        return "Expires tomorrow"
    if days_left <= 3:
        return f"Expiry in {days_left} days"
    if days_left <= 7:
        return f"Expiry in {days_left} days"
    return None


def auto_discount_percent(days_left):
    if days_left is None or days_left < 0:
        return 0
    if days_left <= 1:
        return 50
    if days_left <= 3:
        return 20
    if days_left <= 5:
        return 10
    if days_left <= 7:
        return 5
    return 0


def apply_expiry_discount(product):
    days_left = days_until_expiry(product.expiry_date)
    discount = auto_discount_percent(days_left)
    original_price = product.price
    discounted_price = round(original_price * (1 - discount / 100), 2) if discount else original_price
    return {
        "days_until_expiry": days_left,
        "expiry_label": expiry_label(days_left),
        "expiry_discount_percent": discount,
        "original_price": original_price,
        "discounted_price": discounted_price,
    }


def enrich_product_dict(product_dict, product):
    info = apply_expiry_discount(product)
    product_dict["expiry_date"] = product.expiry_date
    product_dict["tags"] = product.tags or ""
    product_dict["occasion"] = product.occasion or ""
    product_dict["days_until_expiry"] = info["days_until_expiry"]
    product_dict["expiry_label"] = info["expiry_label"]
    product_dict["expiry_discount_percent"] = info["expiry_discount_percent"]
    if info["expiry_discount_percent"]:
        product_dict["original_price"] = info["original_price"]
        product_dict["price"] = info["discounted_price"]
    return product_dict
