from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes  # Correctly importing auth_routes
from routes import ai_coach
from routes import chatbot_handler


app = FastAPI()

ALLOWED_ORIGINS = [
    "https://ai-coach-chat.pages.dev",  # Production frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Only allow trusted domains
    allow_credentials=True,  # Allow authentication credentials (cookies, tokens)
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Only allow necessary HTTP methods
    allow_headers=["Authorization", "Content-Type"],  # Only allow necessary headers
)

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(ai_coach.router, prefix="/chat")
app.include_router(chatbot_handler.router, prefix="/chat")

@app.get("/")
def read_root():
    return {"message": "FastAPI server is running with Stream.io authentication!"}
