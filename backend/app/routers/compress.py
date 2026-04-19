from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
import io, fitz

router = APIRouter()

@router.post("/compress")
async def compress_pdf(files: list[UploadFile] = File(...), level: str = Form("recommended")):
    data = await files[0].read()
    buf = io.BytesIO()

    if level == "extreme":
        doc = fitz.open(stream=data, filetype="pdf")
        doc.save(buf, garbage=4, deflate=True, deflate_images=True, deflate_fonts=True, clean=True)
    elif level == "low":
        reader = PdfReader(io.BytesIO(data))
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        writer.write(buf)
    else:  # recommended
        reader = PdfReader(io.BytesIO(data))
        writer = PdfWriter()
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        writer.write(buf)

    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=compressed.pdf"})
