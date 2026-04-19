from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter
import io

router = APIRouter()

@router.post("/merge")
async def merge_pdf(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(400, "At least 2 PDF files required.")
    writer = PdfWriter()
    for f in files:
        data = await f.read()
        writer.append(io.BytesIO(data))
    buf = io.BytesIO()
    writer.write(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=merged.pdf"})
