"""
ml_client.py
------------
Thin HTTP client for the deployed ML service at Render.
https://ai-assistance-1-m33i.onrender.com

Rules:
- This file is the ONLY place that talks to the ML service.
- Flask's Neon DB is never touched by the ML service.
- The ML service never writes to anything — it only reads Railway DB.
- All functions return plain Python dicts / lists, never ORM objects.
- Every function has a try/except so a slow/down ML service never
  breaks existing routes. Callers receive None on failure.
"""

import os
import requests

ML_BASE = os.getenv("ML_SERVICE_URL", "https://ai-assistance-1-m33i.onrender.com")
TIMEOUT = 10  # seconds — Render free tier can be slow on cold start


def _post(path: str, payload: dict) -> dict | None:
    """POST to ML service. Returns parsed JSON or None on any error."""
    try:
        response = requests.post(
            f"{ML_BASE}{path}",
            json=payload,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        print(f"[ml_client] Timeout calling {path}")
        return None
    except requests.exceptions.ConnectionError:
        print(f"[ml_client] Connection error calling {path}")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"[ml_client] HTTP error {e.response.status_code} calling {path}")
        return None
    except Exception as e:
        print(f"[ml_client] Unexpected error calling {path}: {e}")
        return None


def _get(path: str, params: dict | None = None) -> dict | None:
    """GET from ML service. Returns parsed JSON or None on any error."""
    try:
        response = requests.get(
            f"{ML_BASE}{path}",
            params=params or {},
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        print(f"[ml_client] Timeout calling {path}")
        return None
    except requests.exceptions.ConnectionError:
        print(f"[ml_client] Connection error calling {path}")
        return None
    except requests.exceptions.HTTPError as e:
        print(f"[ml_client] HTTP error {e.response.status_code} calling {path}")
        return None
    except Exception as e:
        print(f"[ml_client] Unexpected error calling {path}: {e}")
        return None


# ---------------------------------------------------------------------------
# Public API — one function per ML capability
# ---------------------------------------------------------------------------

def get_ml_recommendations(user_id: int, goal: str, limit: int = 10) -> list[int] | None:
    """
    Ask the ML service for goal-based product recommendations.

    Returns a list of product_ids (ints) from the Railway DB.
    Flask maps these IDs against its own Neon products table.
    Returns None if ML service is unavailable.
    """
    result = _post("/recommend", {
        "user_id": user_id,
        "goal": goal,
        "limit": limit,
    })
    if result is None:
        return None

    # ML service may return: {"recommended_products": [...], ...}
    # Each item is either a product_id int or a dict with "product_id" / "id"
    raw = result.get("recommended_products") or result.get("products") or []
    return _extract_ids(raw)


def get_ml_personalized(user_id: int, limit: int = 10) -> list[int] | None:
    """
    Ask the ML service for personalized recommendations for a user.

    Returns a list of product_ids or None if unavailable.
    """
    result = _post("/recommend/personalized", {
        "user_id": user_id,
        "limit": limit,
    })
    if result is None:
        return None

    raw = result.get("recommended_products") or result.get("products") or []
    return _extract_ids(raw)


def get_ml_near_expiry(goal: str, limit: int = 5) -> list[int] | None:
    """
    Ask the ML service for near-expiry product suggestions relevant to a goal.

    Returns a list of product_ids or None if unavailable.
    """
    result = _post("/recommend/near-expiry", {
        "goal": goal,
        "limit": limit,
    })
    if result is None:
        return None

    raw = result.get("products") or result.get("recommended_products") or []
    return _extract_ids(raw)


def health_check() -> bool:
    """Returns True if the ML service is reachable."""
    result = _get("/")
    return result is not None


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _extract_ids(items: list) -> list[int]:
    """
    Normalise whatever the ML service returns into a plain list of ints.

    Handles:
      - [1, 2, 3]                          → plain ID list
      - [{"product_id": 1}, ...]           → Railway schema key
      - [{"id": 1}, ...]                   → alternate key
      - [{"product_id": 1, "score": 0.9}]  → with score metadata
    """
    ids = []
    for item in items:
        if isinstance(item, (int, float)):
            ids.append(int(item))
        elif isinstance(item, dict):
            pid = item.get("product_id") or item.get("id")
            if pid is not None:
                ids.append(int(pid))
    return ids
