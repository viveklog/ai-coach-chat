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
chat_client.update_app_settings(webhook_url="https://d352-2406-7400-9a-3ffe-f544-83f0-7d14-fd1c.ngrok-free.app/chat/webhook")

print("✅ Webhook URL successfully updated!")
