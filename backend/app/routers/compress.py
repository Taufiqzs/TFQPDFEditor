from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
import io

router = APIRouter()

@router.post("/compress")
async def compress_pdf(files: list[UploadFile] = File(...)):
    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()
    for page in reader.pages:
        page.compress_content_streams()
        writer.add_page(page)
    writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    buf = io.BytesIO()
    writer.write(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=compressed.pdf"})
