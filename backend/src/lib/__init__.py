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

    # CORS configuration
    # Get allowed origins from environment variable or use defaults
    cors_origins_env = os.getenv('CORS_ORIGINS', '')
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()] if cors_origins_env else []
    
    # Always include localhost for local development
    default_origins = [
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000"
    ]
    # Combine default origins with environment variable origins
    all_origins = list(set(default_origins + allowed_origins))
    
    CORS(app, resources={r"/*": {
        "origins": all_origins if all_origins else ["*"],  # Allow all if no specific origins
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }}, supports_credentials=True)

    init_db_connection()  # ✅ Initialize DB once

    configure_auth(app)
    app.register_blueprint(api_blueprint)
    return app

