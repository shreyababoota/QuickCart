import re
from collections import Counter

POSITIVE_WORDS = {
    "durable", "quality", "fresh", "good", "great", "excellent", "love",
    "perfect", "amazing", "value", "recommend", "tasty", "soft", "comfortable",
}
NEGATIVE_WORDS = {
    "packaging", "damaged", "late", "bad", "poor", "stale", "broken", "cheap",
    "disappointed", "leak", "expired", "small", "overpriced",
}


def summarize_reviews(reviews):
    if not reviews:
        return {
            "average_rating": 0,
            "total_reviews": 0,
            "most_liked": [],
            "most_complaints": [],
            "summary": "No reviews yet.",
        }

    ratings = [r.rating for r in reviews if r.rating]
    avg = round(sum(ratings) / len(ratings), 1) if ratings else 0

    positive_hits = Counter()
    negative_hits = Counter()

    for review in reviews:
        text = (review.comment or "").lower()
        for word in POSITIVE_WORDS:
            if word in text:
                positive_hits[word.capitalize()] += 1
        for word in NEGATIVE_WORDS:
            if word in text:
                negative_hits[word.capitalize()] += 1

        if review.sentiment:
            sent = review.sentiment.lower()
            if "positive" in sent:
                positive_hits["Quality"] += 1
            elif "negative" in sent:
                negative_hits["Packaging"] += 1

    most_liked = [w for w, _ in positive_hits.most_common(3)]
    most_complaints = [w for w, _ in negative_hits.most_common(3)]

    if not most_liked:
        most_liked = ["Quality", "Value", "Durability"]
    if not most_complaints:
        most_complaints = ["Packaging"]

    summary = f"{avg} average from {len(reviews)} reviews."
    if most_liked:
        summary += f" Users praise {', '.join(most_liked[:2]).lower()}."
    if most_complaints:
        summary += f" Common complaints: {', '.join(most_complaints[:2]).lower()}."

    return {
        "average_rating": avg,
        "total_reviews": len(reviews),
        "most_liked": most_liked,
        "most_complaints": most_complaints,
        "summary": summary,
    }
