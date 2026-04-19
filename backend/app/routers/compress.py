from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from pypdf import PdfWriter, PdfReader
import io

router = APIRouter()

def _compress_pages(reader: PdfReader, writer: PdfWriter, compress_streams: bool):
    for page in reader.pages:
        if compress_streams:
            try:
                page.compress_content_streams()
            except Exception:
                pass  # add page as-is if stream compression fails
        writer.add_page(page)

@router.post("/compress")
async def compress_pdf(files: list[UploadFile] = File(...), level: str = Form("recommended")):
    try:
        data = await files[0].read()
        buf = io.BytesIO()
        reader = PdfReader(io.BytesIO(data))
        writer = PdfWriter()

        if level == "extreme":
            _compress_pages(reader, writer, compress_streams=True)
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
            writer.add_metadata({"/Producer": "", "/Creator": "", "/Author": "", "/Title": ""})
        elif level == "low":
            _compress_pages(reader, writer, compress_streams=False)
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        else:  # recommended
            _compress_pages(reader, writer, compress_streams=True)
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)

        writer.write(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="application/pdf",
                                 headers={"Content-Disposition": "attachment; filename=compressed.pdf"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
