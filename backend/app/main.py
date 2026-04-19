import mimetypes
import os
import sys
from fastapi import FastAPI

# Fix Windows registry mapping .js/.css to wrong MIME types
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("image/svg+xml", ".svg")
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import merge, split, compress, pdf_to_jpg, jpg_to_pdf

app = FastAPI(title="TFQPDFEditor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(merge.router, prefix="/api")
app.include_router(split.router, prefix="/api")
app.include_router(compress.router, prefix="/api")
app.include_router(pdf_to_jpg.router, prefix="/api")
app.include_router(jpg_to_pdf.router, prefix="/api")

# Serve React build — works both in dev (if dist/ exists) and in PyInstaller bundle
if getattr(sys, "frozen", False):
    _base = sys._MEIPASS  # type: ignore[attr-defined]
else:
    _base = os.path.join(os.path.dirname(__file__), "..", "..")

_dist = os.path.join(_base, "dist")

if os.path.isdir(_dist):
    app.mount("/", StaticFiles(directory=_dist, html=True), name="static")
