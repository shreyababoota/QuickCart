from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.assistant_service import start_session, process_answer

assistant_bp = Blueprint("assistant", __name__)

sessions = {}


@assistant_bp.route("/start", methods=["POST"])
@jwt_required()
def assistant_start():
    user_id = int(get_jwt_identity())
    data = request.json or {}
    message = data.get("message", "").strip()

    if not message:
        return {"error": "Message is required"}, 400

    context = data.get("context", {})
    session = start_session(message, context)
    session["user_id"] = user_id
    session_id = f"{user_id}-{len(sessions)}"
    sessions[session_id] = session

    return {
        "session_id": session_id,
        "status": session["status"],
        "category": session["category"],
        "next_question": session.get("next_question"),
        "question_number": session.get("question_index", 0) + 1,
        "total_questions": session.get("total_questions", 0),
        "budget": session.get("budget"),
    }


@assistant_bp.route("/answer", methods=["POST"])
@jwt_required()
def assistant_answer():
    user_id = int(get_jwt_identity())
    data = request.json or {}
    session_id = data.get("session_id")
    answer = data.get("answer", "").strip()

    if not session_id or session_id not in sessions:
        return {"error": "Invalid session"}, 400
    if not answer:
        return {"error": "Answer is required"}, 400

    session = sessions[session_id]
    if session.get("user_id") != user_id:
        return {"error": "Unauthorized session"}, 403

    context = data.get("context", {})
    updated = process_answer(session, answer, context)
    sessions[session_id] = updated

    if updated["status"] == "complete":
        return {
            "session_id": session_id,
            "status": "complete",
            "must_buy": updated["must_buy"],
            "optional": updated["optional"],
            "forget_list": updated["forget_list"],
            "recommended_products": updated["recommended_products"],
            "budget": updated.get("budget"),
            "category": updated.get("category"),
        }

    return {
        "session_id": session_id,
        "status": "collecting",
        "next_question": updated.get("next_question"),
        "question_number": updated.get("question_index", 0) + 1,
        "total_questions": updated.get("total_questions", 0),
    }
