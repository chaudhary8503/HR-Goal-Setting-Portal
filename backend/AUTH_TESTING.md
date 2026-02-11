# Authentication Testing Guide

This document explains how to test the authentication system in the SMART Goals Generator application.

## Prerequisites

1. Make sure the application is running:
   ```
   python src/app.py
   ```
   or using the provided scripts:
   ```
   ./start.ps1  # For PowerShell
   ```
   or 
   ```
   start.bat  # For Command Prompt
   ```

2. Make sure you have the required Python packages:
   ```
   pip install requests
   ```

## Testing Authentication with test_auth.py

We've provided a script to test the authentication flow:

```
python test_auth.py [email] [password]
```

Replace `[email]` and `[password]` with valid credentials from your database.

This script will:
1. Attempt to log in and get a JWT token
2. Test the protected endpoint with the token
3. Test the SMART goals generation endpoint with the token

## Manual Testing with Curl or Postman

### 1. Login to get a token

```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email@example.com","password":"your_password"}'
```

Save the token from the response.

### 2. Test a protected endpoint

```
curl -X GET http://localhost:5000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Replace `YOUR_TOKEN` with the token received from the login request.

### 3. Generate SMART goals

```
curl -X POST http://localhost:5000/api/generate-smart-goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "jobTitle": "Software Engineer",
    "department": "Engineering",
    "goalDescription": "Improve test coverage",
    "keyResult": "Increase test coverage to 80%",
    "dueDate": "2025-12-31",
    "managersGoal": "Improve code quality"
  }'
```

## Troubleshooting

If you encounter authentication issues:

1. Check that the token is being included correctly in the Authorization header
2. Make sure the token hasn't expired (tokens expire after 24 hours)
3. Check the server logs for any authentication errors
4. Verify that the SECRET_KEY in the application matches the one used to generate the token

## How Authentication Works

1. User logs in with email/password
2. Server verifies credentials against the database
3. If valid, server generates a JWT token with user info and expiration
4. Client stores the token and includes it in the Authorization header for protected requests
5. For protected endpoints, the @login_required decorator:
   - Extracts the token from the Authorization header
   - Verifies the token's signature and expiration
   - Sets g.user with the decoded token payload
   - Allows the request to proceed if valid
