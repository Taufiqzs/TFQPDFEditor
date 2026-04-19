# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import collect_data_files, collect_all

block_cipher = None

crypto_datas, crypto_binaries, crypto_hiddenimports = collect_all("cryptography")
httpx_datas, httpx_binaries, httpx_hiddenimports = collect_all("httpx")

datas = []
datas += collect_data_files("reportlab")
datas += crypto_datas
datas += httpx_datas

# Include the React build output (built before running PyInstaller)
dist_dir = os.path.join("..", "frontend", "dist")
datas += [(dist_dir, "dist")]

a = Analysis(
    ["run.py"],
    pathex=["."],
    binaries=crypto_binaries + httpx_binaries,
    datas=datas,
    hiddenimports=crypto_hiddenimports + httpx_hiddenimports + [
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
        "app.license",
        "cryptography",
        "cryptography.fernet",
        "cryptography.hazmat.primitives.ciphers.aead",
        "httpx",
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
