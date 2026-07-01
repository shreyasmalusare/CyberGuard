from fastapi import FastAPI

from app.core.config import settings
from app.core.logger import app_logger
from app.database.init_db import init_database
from fastapi.middleware.cors import CORSMiddleware
# NEW IMPORT
from app.api.routes.scan import router as scan_router


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():

    app_logger.info("Starting Cyber VulnScanner Backend")

    init_database()

    app_logger.info("Database Initialized Successfully")


@app.get("/")
async def root():
    return {
        "message": "Cyber VulnScanner Backend Running",
        "version": settings.APP_VERSION,
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


# NEW: Register scanner API
app.include_router(scan_router)