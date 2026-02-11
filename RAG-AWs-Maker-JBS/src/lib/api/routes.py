from flask import request, jsonify, g, session
from datetime import datetime, timedelta
from . import api_blueprint
from ..utils.auth import login_required, SECRET_KEY
from .smart_goals import SMARTGoalsGenerator
from lib.db.database import save_goal
import bcrypt
import jwt 
from lib.db.db_connection import get_db_connection

from lib.db.database import get_user
import os
import json

def load_prompts():
    prompts_path = os.path.join(os.path.dirname(__file__), '..', 'utils', 'prompts.json')
    try:
        with open(prompts_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load prompts.json: {e}")
        return {}

# Initialize SMART Goals Generator
try:
    api_key = os.getenv("GEMINI_API_KEY")
    smart_goals_generator = SMARTGoalsGenerator(api_key=api_key)
    print("SMART Goals Generator initialized successfully")
except Exception as e:
    print(f"Failed to initialize SMART Goals Generator: {e}")
    smart_goals_generator = None

@api_blueprint.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "generator_status": "initialized" if smart_goals_generator else "failed"
    })

@api_blueprint.route('/api/generate-smart-goals', methods=['POST'])
# @login_required
def api_generate_smart_goals():
    """API endpoint to generate 3 SMART goals using LangChain"""
    print("Received request:", request.json)  # Debug log
    
    try:
        # Check if generator is initialized
        if not smart_goals_generator:
            return jsonify({
                "error": "SMART Goals Generator not initialized. Please check your Google API key configuration."
            }), 500
        
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
        
        # Validate required fields
        required_fields = ['jobTitle', 'department', 'goalDescription', 'keyResult', 'dueDate']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Extract data with default values
        job_title = data['jobTitle']
        department = data['department']
        goal_description = data['goalDescription']
        key_results = data['keyResult']
        deadline = data['dueDate']
        managers_goal = data.get('managersGoal', 'Support team objectives and organizational goals')
        
        print(f"Generating goals for {job_title} in {department}")
        
        # Generate 3 SMART goals using LangChain
        goals_data = smart_goals_generator.generate_smart_goals(
            job_title=job_title,
            department=department,
            goal_description=goal_description,
            key_results=key_results,
            deadline=deadline,
            managers_goal=managers_goal
        )
        
        # print("Generated goals:", goals_data)  # Debug log
          # Save to file (optional)
        try:
            with open("langchain_smart_goals_output.txt", "w", encoding="utf-8") as file:
                file.write(str(goals_data))
        except Exception as e:
            print(f"Warning: Could not save to file: {e}")

        
        '''
        goals_data is like:
        goals_data = [
            {
                "title": "Achieve Primary Objective Through Strategic Planning",
                "description": "Develop and execute a comprehensive plan to automate systems with AI by December 2025, focusing on improved test coverage through systematic approach and stakeholder engagement.",
                "kpi": "100% completion of planned milestones by December 2025",
                "companyTopBetAlignment": "INVESTING FOR SCALE - Building scalable processes and infrastructure",
                "framework3E": "ELEVATE - Focus on growth and systematic improvement of existing operations",
                "coreValue": "CORE VAL-4 (Simplify to Amplify) - Clear planning and structured approach"
            },
            ...
        ]
        '''


        # Return response with goals array
        return jsonify({
            "success": True,
            "goals": goals_data, # goals_data is a list of dictionaries each containing goal details
            "timestamp": datetime.now().isoformat(),
            "goals_count": len(goals_data),
            "method": "langchain"
        })
        
    except ValueError as e:
        return jsonify({"error": f"Configuration error: {str(e)}"}), 500
    except Exception as e:
        print(f"Error in API endpoint: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500



@api_blueprint.route('/api/save-user-goal', methods=['POST']) 
def save_user_goal():
    try:
        goal = request.get_json(force=True)
    except Exception as e:
        print(f"JSON parsing error: {str(e)}")
        return jsonify({"message": f"Failed to parse JSON: {str(e)}"}), 400

    # Validate input
    if not goal:
        return jsonify({"error": "No JSON data provided"}), 400
    

    

    
    required_fields = ['title', 'description', 'kpi', 'companyTopBetAlignment', 'framework3E', 'coreValue']
    missing_fields = [field for field in required_fields if not goal.get(field)]


    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # now save the goal to the DB
    try:
        response = save_goal(goal)
        if not response:
            return jsonify({"error": "Failed to save user goal"}), 500
        # send the user goal back as response
        return jsonify({
            "success": True,
            "goal": response,
            "message": "User goal saved successfully"
        }), 200

    except Exception as e:
        print(f"Error saving user goal: {str(e)}")
        return jsonify({"error": f"Failed to save user goal: {str(e)}"}), 500
    




@api_blueprint.route('/api/edit-user-goal', methods=['POST']) # assuming this function can be only called by authenticated users
# @login_required
def edit_user_goal():
    try:
        goal = request.get_json(force=True)
    except Exception as e:
        print(f"JSON parsing error: {str(e)}")
        return jsonify({"message": f"Failed to parse JSON: {str(e)}"}), 400

    # Validate input
    if not goal:
        return jsonify({"error": "No JSON data provided"}), 400

    # Validate required fields
    # for ele in goal['goal']:
    #     print(f"Goal element: {ele}", flush=True)

    goal_data = goal.get("goal", {})
    
    required_fields = ['title', 'description', 'kpi', 'companyTopBetAlignment', 'framework3E', 'coreValue']
    missing_fields = [field for field in required_fields if not goal_data.get(field)]


    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    comment = goal.get("comment", "")

    # Call the function to update the user goal in the database
    try:
        edited_goal = smart_goals_generator._update_user_goal(goal_data, comment) # to be implemented in smart_goals.py
        if not edited_goal:
            return jsonify({"error": "Failed to update user goal"}), 500
   
        # send the user edited goal back as response
        return jsonify({
            "success": True,
            "goal": edited_goal,
            "message": "User goal updated successfully"
        }), 200

    except Exception as e:
        print(f"Error updating user goal: {str(e)}")
        return jsonify({"error": f"Failed in updating user goal: {str(e)}"}), 500



@api_blueprint.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json(force=True)
        print(f"Request headers: {request.headers}", flush=True)
        print(f"Login request received for email: {data.get('email')}", flush=True)
    except Exception as e:
        print(f"JSON parsing error: {str(e)}", flush=True)
        return jsonify({"message": f"Failed to parse JSON: {str(e)}"}), 400
        
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        print(f"Missing email or password: email={email}, password={'*' * len(password) if password else None}", flush=True)
        return jsonify({"message": "Email and password are required"}), 400
    
    # Hardcoded authentication - no database lookup
    HARDCODED_EMAIL = 'antech@gmail.com'
    HARDCODED_PASSWORD = 'antech123'
    
    if email != HARDCODED_EMAIL or password != HARDCODED_PASSWORD:
        print(f"Invalid credentials for email: {email}", flush=True)
        return jsonify({"message": "Invalid email or password"}), 401
    
    # Generate JWT token
    token_payload = {
        'email': email,
        'name': 'Demo User',
        'role': 'user',
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow()  # Issued at time
    }
    
    token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')
    print(f"Login successful for user: {email}", flush=True)

    prompts_data = load_prompts()
    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "name": "Demo User",
            "department": "Engineering",
            "designation": "Software Engineer",
            "managers_goal": "Support team objectives and organizational goals"
        },
        "prompts": prompts_data
    }), 200

@api_blueprint.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)
        print(f"Register request body: {data}")
    except Exception as e:
        print(f"JSON parsing error: {str(e)}")
        return jsonify({"message": f"Failed to parse JSON: {str(e)}"}), 400
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    if not email or not password:
        print(f"Missing email or password: email={email}, password={'*' * len(password) if password else None}")
        return jsonify({"message": "Email and password are required"}), 400
    # Implement your user storage logic here (e.g., check if user exists, store user)
    # For now, just return success
    try:
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    except Exception as e:
        print(f"Password hashing error: {str(e)}")
        return jsonify({"message": "Error hashing password"}), 500
    # Store user in your database here
    print(f"User registered: {email}")
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "email": email,
            "name": name,
            "role": "user"
        }
    }), 201

@api_blueprint.route('/api/password/hash', methods=['POST'])
def hash_password():
    try:
        data = request.get_json(force=True)
    except Exception as e:
        print(f"JSON parsing error: {str(e)}")
        return jsonify({"message": f"Failed to parse JSON: {str(e)}"}), 400
    password = data.get('password')
    if not password:
        return jsonify({"error": "Password is required"}), 400
    try:
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        return jsonify({"hashed_password": hashed}), 200
    except Exception as e:
        print(f"Password hashing error: {str(e)}")
        return jsonify({"message": "Error hashing password"}), 500

@api_blueprint.route('/api/protected', methods=['GET'])
@login_required
def protected():
    """A test endpoint to verify if authentication is working correctly"""
    if g.user:
        return jsonify({
            "message": f"Welcome {g.user.get('email')}, you are authenticated!", 
            "user": g.user,
            "timestamp": datetime.now().isoformat()
        }), 200
    else:
        # This should never happen because the login_required decorator would have already returned a 401
        return jsonify({"error": "Authentication failed"}), 401

@api_blueprint.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@api_blueprint.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@api_blueprint.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500
