from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from app.routes.generate import router as generate_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(generate_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)