@echo off
setlocal
title Reparar disco D: - Dulce Contraste

set "PROYECTO=%~dp0"
set "RESULTADO=%PROYECTO%chkdsk_resultado.txt"
set "VERIFICACION=%PROYECTO%chkdsk_verificacion.txt"

echo ==========================================================
echo    REPARACION DEL SISTEMA DE ARCHIVOS DE LA UNIDAD D:
echo ==========================================================
echo.
echo  Que hace este proceso:
echo    1. Cierra la aplicacion Dulce Contraste (puerto 3000)
echo    2. Repara la tabla de permisos (descriptores de seguridad)
echo    3. Verifica que ya no queden problemas
echo.
echo  IMPORTANTE:
echo    - Se recomienda EJECUTAR COMO ADMINISTRADOR
echo      (clic derecho sobre este archivo ^> Ejecutar como administrador)
echo    - La unidad D: se desmontara unos segundos.
echo    - Cierra Word, Excel y cualquier programa que use archivos de D:.
echo.
pause
echo.

echo [1/4] Cerrando la aplicacion Dulce Contraste...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo        Deteniendo proceso %%a
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 3 /nobreak >nul

rem Nos movemos fuera de D: para no bloquear el desmontaje
cd /d "%SystemDrive%\"

echo [2/4] Reparando la unidad D: ...
echo        (respondiendo "S" al desmontaje automaticamente)
echo S| chkdsk D: /spotfix > "%RESULTADO%" 2>&1
type "%RESULTADO%"

echo.
echo [3/4] Verificando que la reparacion haya funcionado...
echo        (esto puede tardar unos segundos)
echo S| chkdsk D: /scan > "%VERIFICACION%" 2>&1

findstr /C:"Windows ha encontrado problemas" "%VERIFICACION%" >nul
if %errorlevel%==0 (
    echo.
    echo    *** RESULTADO: AUN QUEDAN PROBLEMAS PENDIENTES ***
    echo    Revisa el archivo:
    echo      %VERIFICACION%
    echo.
    echo    Si el problema persiste, es posible que necesites
    echo    programar la reparacion para el proximo reinicio:
    echo      fsutil dirty set D:
    echo    y luego reiniciar el equipo.
) else (
    echo.
    echo    *** RESULTADO: REPARACION COMPLETADA CORRECTAMENTE ***
    echo    El sistema de archivos de D: ya no tiene problemas.
)

echo.
echo [4/4] Informes guardados en:
echo        %RESULTADO%
echo        %VERIFICACION%
echo.
echo Para volver a usar la aplicacion ejecuta:  iniciar_servidor.bat
echo.
pause
endlocal
