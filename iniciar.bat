@echo off
echo Iniciando servidor...
echo Abre en el navegador: http://localhost:8000/admin.html
echo Para la TV usa: http://localhost:8000/tv.html
echo.
echo Presiona Ctrl+C para parar
python -m http.server 8000
pause
