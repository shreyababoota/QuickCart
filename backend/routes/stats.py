from flask import Blueprint

from services.analytics_service import get_analytics

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/", methods=["GET"])
def get_stats():
    return get_analytics()
