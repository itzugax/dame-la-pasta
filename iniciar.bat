@echo off
echo.
echo  Limpiando procesos previos en el puerto 5000...
:: Busca el proceso en el puerto 8080 y lo mata si existe
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a 2>nul

echo  Iniciando servidor sin cache...
echo  Admin: http://localhost:5000/admin.html
echo  TV:    http://localhost:5000/tv.html
echo.
echo  Presiona Ctrl+C para parar (No cierres la ventana con la X)
echo.
python servidor.py
pause