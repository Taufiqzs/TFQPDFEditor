from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import pypdfium2 as pdfium
import io, zipfile

router = APIRouter()

@router.post("/pdf-to-jpg")
async def pdf_to_jpg(files: list[UploadFile] = File(...)):
    data = await files[0].read()
    try:
        doc = pdfium.PdfDocument(data)
    except Exception as e:
        raise HTTPException(400, f"Could not open PDF: {e}")

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i, page in enumerate(doc):
            bitmap = page.render(scale=150/72)
            img = bitmap.to_pil()
            img_buf = io.BytesIO()
            img.save(img_buf, format="JPEG", quality=90)
            zf.writestr(f"page_{i+1}.jpg", img_buf.getvalue())
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/zip",
                             headers={"Content-Disposition": "attachment; filename=pages.zip"})
