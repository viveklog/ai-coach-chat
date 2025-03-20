import os
import stream_chat
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Stream Chat client
STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

chat_client = stream_chat.StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

# ✅ Correct Method to Set Webhook URL
chat_client.update_app_settings(webhook_url="https://ai-coach-server.onrender.com/chat/webhook")

print("✅ Webhook URL successfully updated!")
