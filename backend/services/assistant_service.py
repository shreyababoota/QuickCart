import re
from datetime import datetime

from services.recommendation_engine import detect_goal_category, get_recommendations

ASSISTANT_QUESTIONS = {
    "trip": [
        {"key": "days", "question": "How many days is your trip?"},
        {"key": "group", "question": "Solo or group travel?"},
        {"key": "hotel", "question": "Need hotel booking items? (yes/no)"},
        {"key": "beach", "question": "Need beach accessories? (yes/no)"},
        {"key": "electronics", "question": "Need electronics? (yes/no)"},
        {"key": "medicines", "question": "Need medicines? (yes/no)"},
        {"key": "essentials", "question": "Need travel essentials? (yes/no)"},
    ],
    "gym": [
        {"key": "level", "question": "Beginner or advanced fitness level?"},
        {"key": "space", "question": "Home gym or gym membership setup?"},
        {"key": "equipment", "question": "Need weights and resistance gear? (yes/no)"},
        {"key": "nutrition", "question": "Need protein and nutrition items? (yes/no)"},
    ],
    "semester": [
        {"key": "year", "question": "Which year of study?"},
        {"key": "tech", "question": "Need laptop or tablet? (yes/no)"},
        {"key": "stationery", "question": "Need notebooks and stationery? (yes/no)"},
        {"key": "hostel", "question": "Staying in hostel? (yes/no)"},
    ],
    "weight_loss": [
        {"key": "target", "question": "What is your weight loss target?"},
        {"key": "diet", "question": "Vegetarian or non-vegetarian diet?"},
        {"key": "snacks", "question": "Need healthy snacks? (yes/no)"},
        {"key": "hydration", "question": "Need water bottle or shaker? (yes/no)"},
    ],
    "general": [
        {"key": "budget", "question": "What is your approximate budget in ₹?"},
        {"key": "category", "question": "Which category are you shopping for?"},
        {"key": "priority", "question": "Must-have vs nice-to-have — what matters most?"},
    ],
}

MUST_BUY = {
    "trip": ["Sunscreen", "Sunglasses", "Power Bank"],
    "gym": ["Dumbbells", "Resistance Bands", "Yoga Mat"],
    "semester": ["Laptop", "Notebook", "Backpack"],
    "weight_loss": ["Protein Foods", "Healthy Snacks", "Water Bottle"],
    "general": ["Essentials"],
}

OPTIONAL = {
    "trip": ["Waterproof Bag", "Bluetooth Speaker"],
    "gym": ["Protein Shaker", "Gym Gloves"],
    "semester": ["USB Hub", "External SSD"],
    "weight_loss": ["Yoga Mat", "Fitness Tracker"],
    "general": ["Accessories"],
}

FORGET_LIST = {
    "trip": ["Charger", "ID Card", "Power Bank", "Medicines"],
    "gym": ["Water Bottle", "Towel", "Protein Bar"],
    "semester": ["Extension Cord", "Desk Lamp", "Notebook"],
    "weight_loss": ["Shaker Bottle", "Measuring Cup", "Snacks"],
    "general": ["Charger", "Batteries"],
}


def extract_budget(text):
    match = re.search(r"(?:budget|₹|rs\.?|inr)\s*(\d[\d,]*)", text.lower())
    if match:
        return float(match.group(1).replace(",", ""))
    nums = re.findall(r"\b(\d{4,6})\b", text)
    if nums:
        return float(nums[0])
    return None


def start_session(message, context=None):
    category = detect_goal_category(message)
    budget = extract_budget(message)
    questions = ASSISTANT_QUESTIONS.get(category, ASSISTANT_QUESTIONS["general"])

    return {
        "status": "collecting",
        "category": category,
        "goal_text": message,
        "context": context or {},
        "budget": budget,
        "question_index": 0,
        "answers": {},
        "next_question": questions[0]["question"] if questions else None,
        "total_questions": len(questions),
    }


def process_answer(session, answer, context=None):
    category = session.get("category", "general")
    questions = ASSISTANT_QUESTIONS.get(category, ASSISTANT_QUESTIONS["general"])
    idx = session.get("question_index", 0)
    answers = dict(session.get("answers", {}))

    if idx < len(questions):
        answers[questions[idx]["key"]] = answer.strip()
        idx += 1

    if idx < len(questions):
        return {
            **session,
            "status": "collecting",
            "question_index": idx,
            "answers": answers,
            "next_question": questions[idx]["question"],
            "context": context or session.get("context", {}),
        }

    return finalize_session({**session, "answers": answers, "question_index": idx, "context": context or session.get("context", {})})


def finalize_session(session):
    category = session.get("category", "general")
    goal_text = session.get("goal_text", "")
    answers = session.get("answers", {})
    enriched_goal = goal_text + " " + " ".join(f"{k}:{v}" for k, v in answers.items())

    must_buy = MUST_BUY.get(category, MUST_BUY["general"])
    optional = OPTIONAL.get(category, OPTIONAL["general"])
    forget = FORGET_LIST.get(category, FORGET_LIST["general"])

    from models.user import User
    from models.product import Product
    from services.ml_client import get_ml_recommendations

    user_id = session.get("user_id")
    user = User.query.get(user_id) if user_id else None
    context = session.get("context", {})

    # Try ML service first; fall back to local scoring
    products = None
    if user_id:
        ml_ids = get_ml_recommendations(user_id=user_id, goal=enriched_goal, limit=10)
        if ml_ids:
            rows = Product.query.filter(Product.id.in_(ml_ids)).all()
            row_map = {p.id: p for p in rows}
            ordered = [row_map[pid] for pid in ml_ids if pid in row_map]
            if ordered:
                products = ordered

    if products is None:
        products, _ = get_recommendations(enriched_goal, user, limit=10, context=context)

    return {
        **session,
        "status": "complete",
        "must_buy": must_buy,
        "optional": optional,
        "forget_list": forget,
        "recommended_products": [p.to_dict() for p in products],
        "next_question": None,
    }


def log_interaction(user_id, product_id, action):
    from database.db import db
    from models.interaction import Interaction

    code = f"int-{user_id}-{product_id}-{datetime.utcnow().timestamp()}"
    inter = Interaction(
        interaction_code=code[:20],
        user_id=user_id,
        product_id=product_id,
        action=action,
        timestamp=datetime.utcnow().isoformat(),
    )
    db.session.add(inter)
    db.session.commit()
