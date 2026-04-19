from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pypdf import PdfReader, PdfWriter
import io, zipfile

router = APIRouter()

def parse_pages(spec: str, total: int) -> list[int]:
    """Parse '1,3,5-8' into 0-based page indices."""
    if not spec.strip():
        return list(range(total))
    indices = []
    for part in spec.split(','):
        part = part.strip()
        if '-' in part:
            a, b = part.split('-', 1)
            indices.extend(range(int(a) - 1, int(b)))
        else:
            indices.append(int(part) - 1)
    return [i for i in indices if 0 <= i < total]

@router.post("/split")
async def split_pdf(files: list[UploadFile] = File(...), pages: str = Form("")):
    data = await files[0].read()
    reader = PdfReader(io.BytesIO(data))
    indices = parse_pages(pages, len(reader.pages))

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        for i in indices:
            writer = PdfWriter()
            writer.add_page(reader.pages[i])
            page_buf = io.BytesIO()
            writer.write(page_buf)
            zf.writestr(f"page_{i+1}.pdf", page_buf.getvalue())
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/zip",
                             headers={"Content-Disposition": "attachment; filename=split.zip"})
