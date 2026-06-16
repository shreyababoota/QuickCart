def detect_goal_type(goal_text):
    goal_text = (goal_text or "").lower()

    if any(w in goal_text for w in ["trip", "goa", "travel", "vacation", "beach", "holiday"]):
        return "trip"

    if any(w in goal_text for w in ["gym", "workout", "fitness", "dumbbell", "exercise"]):
        return "gym"

    if any(w in goal_text for w in ["semester", "college", "university", "campus", "hostel"]):
        return "semester"

    if any(w in goal_text for w in ["lose", "weight", "diet", "10kg", "kg"]):
        return "weight_loss"

    return "general"
