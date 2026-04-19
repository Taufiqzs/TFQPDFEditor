@echo off
echo [1/3] Building React frontend...
cd frontend
call npm run build
cd ..

echo [2/3] Installing PyInstaller...
pip install pyinstaller -q

echo [3/3] Packaging with PyInstaller...
cd backend
pyinstaller TFQPDFEditor.spec --noconfirm --clean

echo.
echo Done! Installer output: backend\dist\TFQPDFEditor\
pause
