import psycopg2
import bcrypt


def get_user(connection, email, password):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM employees WHERE email = %s", (email,))
            user = cursor.fetchone()
            if not user:
                return None

            column_names = [desc[0] for desc in cursor.description]
            try:
                stored_hash = user[column_names.index('password')]
            except ValueError:
                return None

            if not stored_hash:
                return None

            # Ensure both password and hash are bytes
            password_bytes = password.encode('utf-8')
            stored_hash_bytes = stored_hash.encode('utf-8') if isinstance(stored_hash, str) else stored_hash

            if not bcrypt.checkpw(password_bytes, stored_hash_bytes):
                return None

            # Gather user info
            def get_value(col):
                try:
                    return user[column_names.index(col)]
                except ValueError:
                    return "Unknown"

            # Get manager's goal if manager_id exists
            manager_id = get_value('manager_id')
            managers_goal = "No goal assigned"
            if manager_id != "Unknown":
                cursor.execute("SELECT goal FROM managers WHERE manager_id = %s", (manager_id,))
                manager_goal_row = cursor.fetchone()
                if manager_goal_row:
                    managers_goal = manager_goal_row[0]

            return {
                'email': get_value('email'),
                'name': get_value('name'),
                'department': get_value('department'),
                'designation': get_value('designation'),
                'managers_goal': managers_goal
            }
    except Exception as e:
        print(f"Error in get_user: {e}")
        return None



def save_goal(goal):
    try:
        print("LOGIC OF SAVING GOAL TO DB HERE!!")
        goal["title"] = "THIS GOAL HAS BEEN SAVED TO THE DB"
        return goal
    except Exception as e:
        raise Exception(f"Error saving goal: {e}")
