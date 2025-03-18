import os
import stream_chat
from fastapi import APIRouter, Request, HTTPException
from dotenv import load_dotenv
import httpx
import time
from datetime import datetime

# Load API keys
load_dotenv()
STREAM_API_KEY = os.getenv("STREAM_API_KEY")
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

AI_COACH_API_URL = "https://2be9-2406-7400-9a-1426-9b2-c5da-ff36-f041.ngrok-free.app/chat/ai-coach"

# Initialize Stream Chat Client
client = stream_chat.StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

router = APIRouter()

# Track processed message IDs to prevent duplicate responses
processed_messages = set()

@router.post("/webhook")
async def handle_chat_event(request: Request):
    """Handles new messages from Stream.io webhook and triggers AI response."""
    try:
        start_time = time.time()
        raw_body = await request.body()
        received_signature = request.headers.get("X-Signature")

        print(f"\n📩 Webhook received at: {datetime.utcnow()}")
        print(f"🔍 Raw Webhook Body: {raw_body.decode('utf-8')}")

        if not received_signature:
            print("❌ ERROR: Missing webhook signature")
            raise HTTPException(status_code=403, detail="Missing webhook signature")

        if not client.verify_webhook(raw_body, received_signature):
            print("❌ ERROR: Invalid webhook signature")
            raise HTTPException(status_code=403, detail="Invalid webhook signature")

        data = await request.json()
        print(f"✅ Parsed Webhook Data: {data}")

        event_type = data.get("type")
        if event_type != "message.new":
            print(f"⚠️ Ignoring event type: {event_type}")
            return {"status": "ignored"}

        message = data["message"]
        message_id = message["id"]
        user_id = message["user"]["id"]
        text = message["text"]
        channel_id = data["channel_id"]

        print(f"📩 New Message from {user_id}: {text}")

        # Prevent duplicate processing
        if message_id in processed_messages:
            print(f"⚠️ Duplicate Message Detected: {message_id}, ignoring...")
            return {"status": "ignored"}

        processed_messages.add(message_id)

        if user_id == "ai_coach":
            print("⚠️ Ignoring AI's own message to prevent infinite loop.")
            return {"message": "AI message ignored."}

        # Show "AI is thinking..." message
        thinking_message = send_ai_message(channel_id, "🤔 AI is thinking...")
        if not thinking_message:
            print("❌ Failed to send AI thinking message")
            return {"status": "error"}

        message_id = thinking_message["message"]["id"]

        # Request AI response
        ai_response = await get_ai_response(user_id, text, timeout=45)

        if ai_response is None:
            print("❌ AI Timeout: Updating 'AI is thinking...' message")
            update_ai_message(message_id, "⚠️ AI is taking longer than expected. Please wait or try again later.")
        else:
            print(f"✅ AI Responded: Updating message {message_id}")
            update_ai_message(message_id, ai_response)

        end_time = time.time()
        print(f"⏳ Total Webhook Processing Time: {end_time - start_time:.2f} seconds")

        return {"status": "success"}

    except Exception as e:
        print(f"❌ Webhook Processing Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Webhook processing error")


async def get_ai_response(user_id: str, user_message: str, timeout: int = 45) -> str:
    """Asynchronously sends user message to AI and gets a response."""
    try:
        start_time = time.time()
        print(f"🔍 Sending async request to AI at {datetime.utcnow()}: {user_message}")

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                AI_COACH_API_URL,
                json={"user_id": user_id, "message": user_message},
                headers={"Connection": "close"}  # Prevents persistent connection issues
            )

        end_time = time.time()
        print(f"⏳ AI API Response Time: {end_time - start_time:.2f} seconds")

        if response.status_code == 200:
            ai_reply = response.json().get("reply", "AI failed to generate a response.")
            print(f"🤖 AI Response Received: {ai_reply}")
            return ai_reply
        else:
            print(f"❌ AI API Error: {response.status_code}, {response.text}")
            return None

    except httpx.TimeoutException:
        print(f"❌ AI Request Timeout after {timeout}s")
        return None


def send_ai_message(channel_id: str, ai_response: str):
    """Sends AI-generated response back into the chat channel and returns message ID."""
    try:
        print(f"📤 Sending AI Message to Channel {channel_id}: {ai_response}")

        channel = client.channel("messaging", channel_id)
        response = channel.send_message({"text": ai_response}, user_id="ai_coach")

        print(f"✅ AI Message Sent Successfully: {response}")
        return response

    except Exception as e:
        print(f"❌ Error Sending AI Message: {str(e)}")
        return None


def update_ai_message(message_id: str, new_text: str):
    """Synchronously updates a previously sent AI message."""
    try:
        updated_message = {"id": message_id, "text": new_text, "user_id": "ai_coach"}
        client.update_message(updated_message)
        print(f"✅ Message updated successfully: {message_id}")
    except Exception as e:
        print(f"❌ Error updating AI message: {e}")


def delete_ai_message(message_id: str, hard_delete=False):
    """Deletes a previously sent AI message."""
    try:
        response = client.delete_message(message_id, hard=hard_delete)
        print(f"✅ Message deleted successfully: {response}")
    except Exception as e:
        print(f"❌ Error deleting AI message: {e}")
