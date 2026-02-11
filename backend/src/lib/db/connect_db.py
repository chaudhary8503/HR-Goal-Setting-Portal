import os
from dotenv import load_dotenv
import psycopg2
from lib.config import Config

def make_db_connection():
    """Fetch user credentials from environment variables."""

    USER = Config.USER
    PASSWORD = Config.PASSWORD
    HOST = Config.HOST
    PORT = Config.PORT
    DBNAME = Config.DBNAME


 
    try:
            connection = psycopg2.connect(
                user=USER,
                password=PASSWORD,
                host=HOST,
                port=PORT,
                dbname=DBNAME
            )
            print("Connection successful to the Database!")
            return connection


    except Exception as e:
            print(f"Connection failed to Database: {str(e)}")
            exit(1)



