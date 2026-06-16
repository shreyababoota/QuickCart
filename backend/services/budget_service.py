def budget_status(budget, spent):
    if not budget or budget <= 0:
        return "green", "Within Budget"

    ratio = spent / budget
    if ratio > 1:
        return "red", "Budget Exceeded"
    if ratio >= 0.85:
        return "yellow", "Approaching Budget Limit"
    return "green", "Within Budget"


def savings_suggestions(goal_products, all_products, spent, budget):
    if not budget or spent <= budget:
        return []

    over_by = spent - budget
    suggestions = []

    sorted_products = sorted(goal_products, key=lambda p: p.price, reverse=True)
    for expensive in sorted_products[:3]:
        category = (expensive.category or "").lower()
        cheaper = [
            p for p in all_products
            if p.id != expensive.id
            and (p.category or "").lower() == category
            and p.price < expensive.price
        ]
        if cheaper:
            alt = min(cheaper, key=lambda p: p.price)
            save = round(expensive.price - alt.price, 2)
            if save > 0:
                suggestions.append({
                    "current_product": expensive.name,
                    "alternative": alt.name,
                    "alternative_id": alt.id,
                    "save_amount": save,
                    "message": f"Switch {expensive.name} to {alt.name} and save ₹{save:.0f}",
                })

    if not suggestions and over_by > 0:
        suggestions.append({
            "message": f"Remove items worth ₹{over_by:.0f} to stay within budget",
            "save_amount": over_by,
        })

    return suggestions[:3]
