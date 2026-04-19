import mimetypes
import os
import sys
import threading
import time

# Fix Windows registry mapping .js/.css to wrong MIME types
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")

import httpx
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.routers import merge, split, compress, pdf_to_jpg, jpg_to_pdf
from app.license import LICENSE_SERVER_URL, get_machine_id, is_activated, save_license

app = FastAPI(title="TFQPDFEditor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Heartbeat watchdog ---
_last_beat = time.time()
_TIMEOUT = 20  # seconds without a heartbeat before shutdown

def _watchdog():
    while True:
        time.sleep(5)
        if time.time() - _last_beat > _TIMEOUT:
            os._exit(0)

threading.Thread(target=_watchdog, daemon=True).start()

@app.post("/api/heartbeat")
async def heartbeat():
    global _last_beat
    _last_beat = time.time()
    return {"ok": True}

@app.post("/api/shutdown")
async def shutdown():
    threading.Thread(target=lambda: (time.sleep(0.3), os._exit(0)), daemon=True).start()
    return Response(status_code=204)

# --- License endpoints ---
class ActivateRequest(BaseModel):
    key: str

@app.get("/api/license-status")
async def license_status():
    return {"activated": is_activated()}

@app.post("/api/activate")
async def activate(req: ActivateRequest):
    machine_id = get_machine_id()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(
                f"{LICENSE_SERVER_URL}/activate",
                json={"key": req.key, "machine_id": machine_id},
            )
            data = res.json()
    except Exception:
        return {"ok": False, "message": "Could not reach license server. Check your internet connection."}
    if data.get("ok"):
        save_license(req.key, machine_id)
    return data

# --- Routers ---
app.include_router(merge.router, prefix="/api")
app.include_router(split.router, prefix="/api")
app.include_router(compress.router, prefix="/api")
app.include_router(pdf_to_jpg.router, prefix="/api")
app.include_router(jpg_to_pdf.router, prefix="/api")

# --- Serve React build ---
if getattr(sys, "frozen", False):
    _base = sys._MEIPASS  # type: ignore[attr-defined]
else:
    _base = os.path.join(os.path.dirname(__file__), "..", "..")

_dist = os.path.join(_base, "dist")

if os.path.isdir(_dist):
    app.mount("/", StaticFiles(directory=_dist, html=True), name="static")
