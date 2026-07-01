from fastapi import APIRouter
from pydantic import BaseModel

from app.services.scanner_service import ScannerService

router = APIRouter(prefix="/api/v1/scan", tags=["Scanner"])


# -----------------------------
# Request Model
# -----------------------------
class ScanRequest(BaseModel):
    url: str


# -----------------------------
# START SCAN
# -----------------------------
@router.post("/start")
async def start_scan(request: ScanRequest):

    result = await ScannerService.run_full_scan(request.url)

    return {
        "success": True,
        "data": result
    }