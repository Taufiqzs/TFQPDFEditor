from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pypdf import PdfWriter, PdfReader
import io

router = APIRouter()

@router.post("/compress")
async def compress_pdf(files: list[UploadFile] = File(...), level: str = Form("recommended")):
    data = await files[0].read()
    buf = io.BytesIO()
    reader = PdfReader(io.BytesIO(data))
    writer = PdfWriter()

    if level == "extreme":
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        # Strip all metadata to squeeze extra bytes
        writer.add_metadata({"/Producer": "", "/Creator": "", "/Author": "", "/Title": ""})
    elif level == "low":
        for page in reader.pages:
            writer.add_page(page)
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
    else:  # recommended
        for page in reader.pages:
            page.compress_content_streams()
            writer.add_page(page)
        writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)

    writer.write(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=compressed.pdf"})
