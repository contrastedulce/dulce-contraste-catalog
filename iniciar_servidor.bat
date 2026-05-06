@echo off
title Servidor Dulce Contraste
echo =========================================
echo   Iniciando Servidor de Dulce Contraste...
echo   Por favor, no cierres esta ventana mientras uses la app.
echo =========================================
cd /d "%~dp0"
npm run dev
