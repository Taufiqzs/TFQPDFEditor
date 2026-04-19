#!/bin/bash
set -e

echo "[1/3] Building React frontend..."
cd frontend && npm run build && cd ..

echo "[2/3] Installing PyInstaller..."
pip install pyinstaller -q

echo "[3/3] Packaging with PyInstaller..."
cd backend
pyinstaller TFQPDFEditor.spec --noconfirm --clean

echo ""
echo "Done! App bundle: backend/dist/TFQPDFEditor.app"
echo "To create a .dmg: hdiutil create -volname TFQPDFEditor -srcfolder backend/dist/TFQPDFEditor.app -ov -format UDZO TFQPDFEditor.dmg"
