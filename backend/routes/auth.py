from flask import Blueprint, request
from models.user import User
from database.db import db
import bcrypt
from flask_jwt_extended import create_access_token
auth_bp = Blueprint(
    "auth",
    __name__
)

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return {
            "error": "Email already exists"
        }, 400

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    user = User(
        name=name,
        email=email,
        password=hashed_password.decode("utf-8")
    )

    db.session.add(user)
    db.session.commit()

    return {
        "message": "User registered successfully"
    }, 201

    
@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return {
            "error": "User not found"
        }, 404

    if not bcrypt.checkpw(
        password.encode("utf-8"),
        user.password.encode("utf-8")
    ):
        return {
            "error": "Invalid password"
        }, 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return {
        "token": access_token,
        "user": user.to_dict()
    }