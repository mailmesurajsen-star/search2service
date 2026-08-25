import os
from dotenv import load_dotenv

# Load .env.local or .env from project root or backend dir
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env.local'))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))
load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://127.0.0.1:27017/search2service")
DB_NAME = os.getenv("DB_NAME", "search2service")
JWT_SECRET = os.getenv("JWT_SECRET", "dev-fallback-not-safe")
COOKIE_NAME = "s2s_token"
JWT_EXPIRATION_SECONDS = 60 * 60 * 24 * 30  # 30 days
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT.lower() == "production"

EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
