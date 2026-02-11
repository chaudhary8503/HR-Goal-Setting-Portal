import os
from dotenv import load_dotenv
from lib.db.connect_db import make_db_connection, get_user

def test_login():
    """Test login functionality with a known email and password."""
    print("📝 Testing Login Functionality")
    print("==============================")
    
    # Connect to the database
    connection = make_db_connection()
    
    # Test email (this should match an email in your database)
    test_email = input("Enter email to test: ")
    test_password = input("Enter password to test: ")
    
    print(f"\nAttempting login with:")
    print(f"Email: {test_email}")
    print(f"Password: {'*' * len(test_password)}")
    
    # Try to authenticate
    user = get_user(connection, test_email, test_password)
    
    if user:
        print("\n✅ Login successful!")
        print(f"User details:")
        print(f"  - Email: {user['email']}")
        print(f"  - Name: {user['name']}")
        print(f"  - Role: {user['role']}")
    else:
        print("\n❌ Login failed.")
    
    # Close connection
    connection.close()

if __name__ == "__main__":
    test_login()
