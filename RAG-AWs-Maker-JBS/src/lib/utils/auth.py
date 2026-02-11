import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, g, current_app
from lib.db.connect_db import *
import psycopg2
from lib.config import Config

SECRET_KEY = Config.JWT_SECRET_KEY

# Helper function for routes that require authentication
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authentication required. No valid token provided."}), 401
        
        token = auth_header.split(' ')[1]
        try:
            # Decode and verify the token
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            # Set the user in g for this request
            g.user = payload
            print(f"User authenticated: {payload.get('email')}", flush=True)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        # Only proceed if we have a valid user
        if not g.user:
            return jsonify({"error": "Authentication required"}), 401
            
        return f(*args, **kwargs)
    return decorated_function

def configure_auth(app):
    """Configure authentication middleware for the app"""
    @app.before_request
    def authenticate():
        # Initialize g.user as None for all requests
        g.user = None
        
        # Skip authentication for public routes
        if request.path in ['/api/health', '/api/auth/login', '/api/auth/register', '/api/password/hash']:
            return
            
        # The actual authentication is handled by the login_required decorator
        
    @app.errorhandler(401)
    def unauthorized(error):
        """Handle unauthorized access attempts"""
        return jsonify({"error": "Authentication required"}), 401
        
    @app.errorhandler(403)
    def forbidden(error):
        """Handle forbidden access attempts"""
        return jsonify({"error": "You don't have permission to access this resource"}), 403