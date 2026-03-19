@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mb.ps1" %*
exit /b %ERRORLEVEL%

