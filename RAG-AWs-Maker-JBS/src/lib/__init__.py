from flask import Flask
from .config import Config
from .utils.auth import configure_auth
from .api import api_blueprint
from flask_cors import CORS
from dotenv import load_dotenv
import os
from lib.db.db_connection import init_db_connection


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": [
        "http://localhost:8080",
        "http://localhost:5173",
        "*"  # Allow all origins for development
    ]}}, supports_credentials=True)

    init_db_connection()  # ✅ Initialize DB once

    configure_auth(app)
    app.register_blueprint(api_blueprint)
    return app

