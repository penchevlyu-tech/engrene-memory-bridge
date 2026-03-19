@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mb-pre.ps1" %*
exit /b %ERRORLEVEL%

