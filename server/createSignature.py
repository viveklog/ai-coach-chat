import hmac
import hashlib
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

def generate_stream_signature(payload: bytes) -> str:
    """Generate a valid Stream.io webhook signature."""
    if not STREAM_API_SECRET:
        raise ValueError("STREAM_API_SECRET is not set. Check your .env file.")

    return hmac.new(
        STREAM_API_SECRET.encode("utf-8"),  # Secret key
        payload,  # Webhook request body (must be bytes)
        hashlib.sha256
    ).hexdigest()

# ✅ Simulate a webhook payload (must be minified JSON)
test_payload = b'{"type":"message.new","message":{"user":{"id":"vivek"},"text":"Hello AI!"},"channel_id":"ai-coach-chat"}'

# ✅ Generate a valid signature
test_signature = generate_stream_signature(test_payload)
print("✅ New Valid Signature:", test_signature)
