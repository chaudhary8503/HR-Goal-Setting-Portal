# test_auth.py
import requests
import sys
import json
import os

BASE_URL = "http://localhost:5000"  # Update if using a different port

def test_login(email, password):
    """Test login and get token"""
    print("\n✅ Testing Login API...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": email, "password": password},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200:
            return result.get("token")
        return None
    except:
        print(f"Failed to parse response: {response.text}")
        return None

def test_protected_endpoint(token):
    """Test the protected endpoint"""
    print("\n✅ Testing Protected API...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/api/protected", headers=headers)
    
    print(f"Status Code: {response.status_code}")
    try:
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
    except:
        print(f"Failed to parse response: {response.text}")

def test_smart_goals_endpoint(token):
    """Test the smart goals generation endpoint"""
    print("\n✅ Testing Smart Goals Generation API...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    test_data = {
        "jobTitle": "Software Engineer",
        "department": "Engineering",
        "goalDescription": "Improve test coverage",
        "keyResult": "Increase test coverage to 80%",
        "dueDate": "2025-12-31",
        "managersGoal": "Improve code quality"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/generate-smart-goals", 
        headers=headers,
        json=test_data
    )
    
    print(f"Status Code: {response.status_code}")
    try:
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
    except:
        print(f"Failed to parse response: {response.text}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python test_auth.py [email] [password]")
        sys.exit(1)
        
    email = sys.argv[1]
    password = sys.argv[2]
    
    token = test_login(email, password)
    
    if token:
        print(f"\nToken received: {token[:20]}...{token[-20:]}")
        test_protected_endpoint(token)
        test_smart_goals_endpoint(token)
    else:
        print("\n❌ Login failed, cannot test protected endpoints")
