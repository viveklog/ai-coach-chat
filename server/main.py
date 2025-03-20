from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes  # Correctly importing auth_routes
from routes import ai_coach
from routes import chatbot_handler


app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["https://ai-coach-chat.pages.dev"],  # Allow requests from React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_routes.router, prefix="/auth")
app.include_router(ai_coach.router, prefix="/chat")
app.include_router(chatbot_handler.router, prefix="/chat")

@app.get("/")
def read_root():
    return {"message": "FastAPI server is running with Stream.io authentication!"}
