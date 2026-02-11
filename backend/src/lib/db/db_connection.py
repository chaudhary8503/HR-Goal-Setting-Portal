# lib/db/db_connection.py

from lib.db.connect_db import make_db_connection

db_connection = None

def init_db_connection():
    global db_connection
    if db_connection is None:
        db_connection = make_db_connection()
    return db_connection

def get_db_connection():
    return db_connection
