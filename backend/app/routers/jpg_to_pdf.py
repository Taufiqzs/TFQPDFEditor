from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import io

router = APIRouter()

@router.post("/jpg-to-pdf")
async def jpg_to_pdf(files: list[UploadFile] = File(...)):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    page_w, page_h = A4

    for f in files:
        data = await f.read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img_w, img_h = img.size
        scale = min(page_w / img_w, page_h / img_h)
        draw_w, draw_h = img_w * scale, img_h * scale
        x = (page_w - draw_w) / 2
        y = (page_h - draw_h) / 2

        img_buf = io.BytesIO()
        img.save(img_buf, format="JPEG")
        img_buf.seek(0)
        from reportlab.lib.utils import ImageReader
        c.drawImage(ImageReader(img_buf), x, y, draw_w, draw_h)
        c.showPage()

    c.save()
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=images.pdf"})
