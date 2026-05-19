import os
from dotenv import load_dotenv

# Get the directory of the current file and load .env from there
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

# Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
raw_model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_MODEL = raw_model.strip("'\"") if raw_model else "gemini-2.5-flash"

# Database
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 3306)),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "pathobondhu"),
    "charset": "utf8mb4",
    "use_pure": True
}

# App
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", 8000))
DEBUG = os.getenv("DEBUG", "false").lower() == "true"