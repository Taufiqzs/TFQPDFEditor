from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import fitz  # pymupdf
import io, zipfile

router = APIRouter()

@router.post("/pdf-to-jpg")
async def pdf_to_jpg(files: list[UploadFile] = File(...)):
    data = await files[0].read()
    try:
        doc = fitz.open(stream=data, filetype="pdf")
    except Exception as e:
        raise HTTPException(400, f"Could not open PDF: {e}")

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=150)
            zf.writestr(f"page_{i+1}.jpg", pix.tobytes("jpeg"))
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/zip",
                             headers={"Content-Disposition": "attachment; filename=pages.zip"})
