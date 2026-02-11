import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env
load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    USER=os.getenv("user")
    PASSWORD=os.getenv("password")
    HOST=os.getenv("host")
    PORT=os.getenv("port")
    DBNAME=os.getenv("dbname")
    BASE_URL = os.getenv("API_BASE_URL")
    # DEBUG = ENV == "development"
    

    