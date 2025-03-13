import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from mistralai import Mistral  # ✅ Correct Import

# Load API key
load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

# Initialize Mistral Client
client = Mistral(api_key=MISTRAL_API_KEY)

router = APIRouter()

# Define request body model
class UserMessage(BaseModel):
    user_id: str
    message: str

# In-memory chat history (basic memory)
chat_memory = {}

@router.post("/ai-coach", tags=["AI Coach"])
def ai_reply(data: UserMessage):
    try:
        print(f"📩 User ({data.user_id}) asked: {data.message}")

        # Ensure user has chat history
        if data.user_id not in chat_memory:
            chat_memory[data.user_id] = []

        # Append user message to history
        chat_memory[data.user_id].append({"role": "user", "content": data.message})

        # Define AI system behavior
        system_message = {"role": "system", "content": "You are an AI Coach that helps users learn interactively."}

        # Prepare conversation history
        messages = [system_message] + chat_memory[data.user_id]

        # ✅ Correct API Call with Model Name
        response = client.chat.complete(
            model="mistral-small-latest",  # ✅ Explicitly specify the model
            messages=messages
        )

        print(f"🔍 Raw API Response: {response}")  # ✅ Print full API response

        # ✅ Fix response extraction (New format)
        ai_response = response.choices[0].message.content  # ✅ Correct way to access response

        print(f"✅ AI Coach Reply: {ai_response}")

        # Store AI response in memory
        chat_memory[data.user_id].append({"role": "assistant", "content": ai_response})

        return {"reply": ai_response}

    except Exception as e:
        print(f"❌ AI Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI Response Error: {str(e)}")
