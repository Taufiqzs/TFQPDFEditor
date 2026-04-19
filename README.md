# TFQPDFEditor

A web-based PDF tool suite built with React + FastAPI. Runs as a local desktop app (packaged with PyInstaller) or as a web service.

---

## Features

### Merge PDF
Combine multiple PDF files into a single document.
- Upload 2 or more PDF files via drag-and-drop
- Drag to reorder files before merging
- Downloads as `merged.pdf`

### Split PDF
Visually select which pages to keep or remove.
- Renders all pages as thumbnails in a responsive grid
- Click any page to mark it for deletion (red overlay)
- Click again to unmark
- Downloads kept pages as a ZIP of individual PDFs (`page_1.pdf`, `page_2.pdf`, …)

### Compress PDF
Reduce PDF file size with three compression levels.

| Level | What it does |
|---|---|
| **Low** | Deduplicates identical objects — minimal changes, lossless |
| **Recommended** | Compresses content streams (zlib) + deduplication — good balance |
| **Extreme** | Max stream compression + re-encodes all images at JPEG quality 35 + strips metadata |

- Shows original file size before compressing
- Shows before/after size comparison and % saved after compressing
- Displays an "already optimized" notice if the file cannot be reduced further

### PDF to JPG
Convert each page of a PDF into a JPG image.
- Renders pages at 150 DPI
- Downloads as a ZIP of JPG files (`page_1.jpg`, `page_2.jpg`, …)

### JPG to PDF
Convert one or more images into a single PDF document.
- Accepts JPG, PNG, and other common image formats
- Each image becomes one A4 page, scaled and centered
- Downloads as `images.pdf`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| PDF processing | pypdf, Pillow, reportlab |
| Desktop packaging | PyInstaller |
| CI/CD | GitHub Actions (builds Windows `.exe` and macOS `.app`) |

---

## Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8765
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the FastAPI backend on port 8765.

---

## Building the Desktop App

```bash
# 1. Build the React frontend
cd frontend && npm install && npm run build

# 2. Package with PyInstaller
cd backend
pip install -r requirements.txt pyinstaller
python -m PyInstaller TFQPDFEditor.spec --noconfirm --clean
```

Output is in `backend/dist/TFQPDFEditor/`.

---

## CI/CD

GitHub Actions automatically builds installers on every push to `main`:
- **Windows**: `TFQPDFEditor-Windows.zip`
- **macOS**: `TFQPDFEditor-Mac.dmg`

Artifacts are retained for 30 days and downloadable from the Actions tab.
