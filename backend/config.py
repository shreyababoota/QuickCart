import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)

    # Deployed ML service — read-only, used for recommendations only
    ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "https://ai-assistance-1-m33i.onrender.com")