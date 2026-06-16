GOAL_KEYWORDS = {
    "trip": [
        "travel", "bag", "sunglasses", "sunscreen", "charger", "power bank",
        "beach", "trip", "goa", "vacation", "headphones", "camera", "umbrella",
        "medicine", "first aid", "towel", "speaker", "watch",
    ],
    "gym": [
        "dumbbell", "resistance", "yoga", "mat", "protein", "fitness", "gym",
        "workout", "exercise", "band", "shaker", "water bottle", "sports",
    ],
    "semester": [
        "laptop", "notebook", "backpack", "tablet", "headphones", "ssd", "hub",
        "college", "semester", "book", "pen", "desk", "study",
    ],
    "weight_loss": [
        "protein", "healthy", "snack", "water bottle", "fitness", "diet",
        "weight", "nutrition", "fruit", "salad", "yoga", "shaker",
    ],
    "general": [],
}


def detect_goal_category(goal_text):
    text = (goal_text or "").lower()
    if any(w in text for w in ["goa", "trip", "travel", "vacation", "beach", "holiday"]):
        return "trip"
    if any(w in text for w in ["gym", "home gym", "workout", "fitness", "dumbbell"]):
        return "gym"
    if any(w in text for w in ["semester", "college", "university", "campus", "hostel"]):
        return "semester"
    if any(w in text for w in ["lose", "weight", "diet", "10kg", "fitness goal"]):
        return "weight_loss"
    return "general"


def score_product(product, goal_text, goal_category, user=None, context=None):
    score = 0
    goal = (goal_text or "").lower()
    haystack = " ".join(filter(None, [
        product.name or "",
        product.category or "",
        product.subcategory or "",
        product.tags or "",
        product.occasion or "",
        product.description or "",
    ])).lower()

    keywords = GOAL_KEYWORDS.get(goal_category, [])
    for kw in keywords:
        if kw in haystack:
            score += 4
        if kw in goal:
            score += 2

    for word in goal.split():
        if len(word) > 3 and word in haystack:
            score += 3

    if product.category and product.category.lower() in goal:
        score += 5

    if user and user.persona:
        persona = user.persona.lower().replace("_", " ")
        if persona in haystack or (product.category and persona in product.category.lower()):
            score += 2

    if user and user.favorite_categories:
        for cat in user.favorite_categories.split(","):
            cat = cat.strip().lower()
            if cat and cat in haystack:
                score += 3

    if context:
        cart = context.get("cart", [])
        wishlist = context.get("wishlist", [])
        
        if str(product.id) in map(str, wishlist):
            score += 5
            
        cart_ids = [str(item.get("id")) for item in cart]
        if str(product.id) in cart_ids:
            score -= 10  # Already in cart

    if user:
        from models.order import Order
        from models.goal import Goal
        
        orders = Order.query.filter_by(user_id=user.id).all()
        for order in orders:
            intent = (order.intent or "").lower()
            if product.category and product.category.lower() in intent:
                score += 2
                
        goals = Goal.query.filter_by(user_id=user.id).all()
        for g in goals:
            if g.goal_text and product.category and product.category.lower() in g.goal_text.lower():
                score += 2

    return score


def get_recommendations(goal_text, user=None, limit=10, context=None):
    from models.product import Product

    goal_category = detect_goal_category(goal_text)
    products = Product.query.all()
    scored = []

    for product in products:
        s = score_product(product, goal_text, goal_category, user, context)
        if s > 0:
            scored.append((s, product))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [p for _, p in scored[:limit]], goal_category


def get_personalized_recommendations(user, limit=10):
    from models.product import Product
    from models.order import Order
    from models.review import Review
    from models.goal import Goal
    from models.interaction import Interaction

    if not user:
        products = Product.query.limit(limit).all()
        return products

    score_map = {}
    products = Product.query.all()

    for product in products:
        score_map[product.id] = 0

    goals = Goal.query.filter_by(user_id=user.id).all()
    for goal in goals:
        _, cat = get_recommendations(goal.goal_text, user, limit=5)
        for kw in GOAL_KEYWORDS.get(cat, []):
            for product in products:
                hay = f"{product.name} {product.tags or ''} {product.category or ''}".lower()
                if kw in hay:
                    score_map[product.id] += 3

    orders = Order.query.filter_by(user_id=user.id).all()
    for order in orders:
        intent = (order.intent or "").lower()
        for product in products:
            if product.category and product.category.lower() in intent:
                score_map[product.id] += 2

    reviews = Review.query.filter_by(user_id=user.id).all()
    reviewed_ids = {r.product_id for r in reviews if r.rating and r.rating >= 4}
    for product in products:
        if product.category:
            for rid in reviewed_ids:
                reviewed = next((p for p in products if p.id == rid), None)
                if reviewed and reviewed.category == product.category:
                    score_map[product.id] += 2

    interactions = Interaction.query.filter_by(user_id=user.id).all()
    for inter in interactions:
        if inter.action in ("view", "cart_add", "purchase"):
            score_map[inter.product_id] = score_map.get(inter.product_id, 0) + 1

    if user.persona:
        for product in products:
            if user.persona.replace("_", " ") in (product.tags or "").lower():
                score_map[product.id] += 2

    ranked = sorted(products, key=lambda p: score_map.get(p.id, 0), reverse=True)
    top = [p for p in ranked if score_map.get(p.id, 0) > 0][:limit]
    if len(top) < limit:
        extras = [p for p in ranked if p not in top][: limit - len(top)]
        top.extend(extras)
    return top[:limit]
