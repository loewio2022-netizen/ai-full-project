from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.routes.generate import router as generate_router

app = FastAPI()
app.include_router(generate_router)
