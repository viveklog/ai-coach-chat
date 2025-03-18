import hmac
import hashlib
import os
from dotenv import load_dotenv

# Load API keys
load_dotenv()
STREAM_API_SECRET = os.getenv("STREAM_API_SECRET")

def generate_signature(raw_body: bytes) -> str:
    """Generate HMAC SHA-256 signature for the exact raw request body."""
    if not STREAM_API_SECRET:
        raise ValueError("STREAM_API_SECRET is not set. Check your .env file.")

    return hmac.new(
        STREAM_API_SECRET.encode("utf-8"),  # ✅ Ensure secret key is bytes
        raw_body if isinstance(raw_body, bytes) else raw_body.encode("utf-8"),  # ✅ Ensure raw_body is bytes
        hashlib.sha256
    ).hexdigest()

def verify_signature(raw_body: bytes, received_signature: str) -> bool:
    """Verify the received webhook signature against the expected one."""
    expected_signature = generate_signature(raw_body)
    return hmac.compare_digest(expected_signature, received_signature)
