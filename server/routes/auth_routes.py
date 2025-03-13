import os
import stream_chat
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Stream.io credentials from .env
STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

# Initialize Stream Chat client
chat_client = stream_chat.StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

# Create API router
router = APIRouter()

# Request Models
class UserSignup(BaseModel):
    username: str
    full_name: str

class UserLogin(BaseModel):
    username: str


def ensure_ai_coach_exists():
    """Create AI Coach user if it does not exist in Stream Chat"""
    try:
        response = chat_client.query_users(filter_conditions={"id": "ai_coach"})
        if not response["users"]:
            print("🆕 Creating AI Coach user in Stream Chat...")
            chat_client.upsert_user({
                "id": "ai_coach",
                "name": "AI Coach",
                "role": "admin"
            })
        else:
            print("✅ AI Coach user already exists.")
    except Exception as e:
        print(f"❌ Error creating AI Coach user: {str(e)}")

# Ensure AI Coach exists when the server starts
ensure_ai_coach_exists()


# ✅ Signup Route
@router.post("/signup")
def signup(user: UserSignup):
    try:
        # Create user in Stream.io
        chat_client.upsert_user({"id": user.username, "name": user.full_name})
        # Generate authentication token
        token = chat_client.create_token(user.username)
        return {"token": token, "user_id": user.username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Login Route
@router.post("/login")
def login(user: UserLogin):
    try:
        # Check if user exists
        response = chat_client.query_users(filter_conditions={"id": user.username})
        if not response["users"]:
            raise HTTPException(status_code=404, detail="User not found")

        # Generate authentication token
        token = chat_client.create_token(user.username)
        return {"token": token, "user_id": user.username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list-users")
def list_users():
    try:
        response = chat_client.query_users({})
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/check-api-key")
def check_api_key():
    return {"STREAM_API_KEY": STREAM_API_KEY}
