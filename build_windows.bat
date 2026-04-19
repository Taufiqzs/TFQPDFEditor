@echo off
echo [1/3] Building React frontend...
cd frontend
call npm run build
if errorlevel 1 (echo Frontend build failed! & pause & exit /b 1)
cd ..

echo [2/3] Installing PyInstaller...
pip install pyinstaller -q

echo [3/3] Packaging with PyInstaller...
cd backend
python -m PyInstaller TFQPDFEditor.spec --noconfirm --clean
if errorlevel 1 (echo PyInstaller failed! & pause & exit /b 1)
cd ..

echo.
echo Done! Output: backend\dist\TFQPDFEditor\TFQPDFEditor.exe
pause
