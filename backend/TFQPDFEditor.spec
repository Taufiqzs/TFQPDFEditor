# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import collect_data_files, collect_dynamic_libs

block_cipher = None

# Collect data files from pymupdf and other packages
datas = []
datas += collect_data_files("fitz")
datas += collect_data_files("reportlab")

# Include the React build output (built before running PyInstaller)
dist_dir = os.path.join("..", "frontend", "dist")
datas += [(dist_dir, "dist")]

a = Analysis(
    ["run.py"],
    pathex=["."],
    binaries=collect_dynamic_libs("fitz"),
    datas=datas,
    hiddenimports=[
        "uvicorn.logging",
        "uvicorn.loops",
        "uvicorn.loops.auto",
        "uvicorn.protocols",
        "uvicorn.protocols.http",
        "uvicorn.protocols.http.auto",
        "uvicorn.protocols.websockets",
        "uvicorn.protocols.websockets.auto",
        "uvicorn.lifespan",
        "uvicorn.lifespan.on",
        "anyio",
        "anyio._backends._asyncio",
        "app.routers.merge",
        "app.routers.split",
        "app.routers.compress",
        "app.routers.pdf_to_jpg",
        "app.routers.jpg_to_pdf",
    ],
    hookspath=[],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="TFQPDFEditor",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,  # no terminal window on Windows
    icon=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="TFQPDFEditor",
)

# macOS .app bundle
app = BUNDLE(
    coll,
    name="TFQPDFEditor.app",
    icon=None,
    bundle_identifier="com.tfq.pdfeditor",
    info_plist={
        "NSHighResolutionCapable": True,
        "CFBundleShortVersionString": "1.0.0",
    },
)
