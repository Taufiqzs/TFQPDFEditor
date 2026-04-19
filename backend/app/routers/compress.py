from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from pypdf import PdfWriter, PdfReader
from pypdf.generic import NameObject
from PIL import Image
import io

router = APIRouter()

def _compress_pages(reader: PdfReader, writer: PdfWriter, stream_level: int = -1):
    for page in reader.pages:
        if stream_level >= 0:
            try:
                page.compress_content_streams(level=stream_level)
            except Exception:
                pass
        writer.add_page(page)

def _recompress_images(writer: PdfWriter, quality: int):
    """Re-encode all images in the PDF at a lower JPEG quality."""
    for page in writer.pages:
        resources = page.get("/Resources")
        if not resources:
            continue
        xobjects = resources.get("/XObject")
        if not xobjects:
            continue
        for key in list(xobjects.keys()):
            try:
                xobj = xobjects[key].get_object()
                if xobj.get("/Subtype") != "/Image":
                    continue
                raw = xobj.get_data()
                w = int(xobj["/Width"])
                h = int(xobj["/Height"])
                cs = str(xobj.get("/ColorSpace", "/DeviceRGB"))
                mode = "L" if "Gray" in cs else "RGB"
                img = Image.frombytes(mode, (w, h), raw)
                if img.mode not in ("RGB", "L"):
                    img = img.convert("RGB")
                out = io.BytesIO()
                img.save(out, "JPEG", quality=quality, optimize=True)
                xobj.set_data(out.getvalue())
                xobj[NameObject("/Filter")] = NameObject("/DCTDecode")
                for k in ["/DecodeParms", "/SMask"]:
                    if NameObject(k) in xobj:
                        del xobj[NameObject(k)]
            except Exception:
                pass  # skip images that can't be re-encoded

@router.post("/compress")
async def compress_pdf(files: list[UploadFile] = File(...), level: str = Form("recommended")):
    try:
        data = await files[0].read()
        buf = io.BytesIO()
        reader = PdfReader(io.BytesIO(data))
        writer = PdfWriter()

        if level == "extreme":
            # Max stream compression + aggressive image re-encoding at low quality
            _compress_pages(reader, writer, stream_level=9)
            _recompress_images(writer, quality=35)
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
            writer.add_metadata({"/Producer": "", "/Creator": "", "/Author": "", "/Title": ""})
        elif level == "low":
            # No stream compression, no image changes — just dedup
            _compress_pages(reader, writer, stream_level=-1)
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)
        else:  # recommended
            # Standard stream compression + dedup, images untouched
            _compress_pages(reader, writer, stream_level=6)
            writer.compress_identical_objects(remove_identicals=True, remove_orphans=True)

        writer.write(buf)
        buf.seek(0)
        return StreamingResponse(buf, media_type="application/pdf",
                                 headers={"Content-Disposition": "attachment; filename=compressed.pdf"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})
