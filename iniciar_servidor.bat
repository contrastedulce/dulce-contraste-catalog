@echo off
title Servidor Dulce Contraste
echo =========================================
echo   Iniciando Servidor de Dulce Contraste...
echo   Por favor, no cierres esta ventana mientras uses la app.
echo =========================================
cd /d "%~dp0"

echo.
echo Deteniendo una instancia previa de la app...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo   Cerrando el proceso %%a que ocupaba el puerto 3000
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

echo Iniciando el servidor...
echo.
npm run dev
pause
