@echo off
setlocal
cd /d "%~dp0"
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo No se encontro npm. Instala Node.js y vuelve a abrir la terminal.
  exit /b 1
)
call npm.cmd run dev
exit /b %errorlevel%
