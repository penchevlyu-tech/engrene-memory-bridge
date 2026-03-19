@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0mb-post.ps1" %*
exit /b %ERRORLEVEL%

