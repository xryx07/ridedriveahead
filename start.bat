@echo off
title RideDriveAhead - Full Stack Mobility Platform
cls
echo ========================================================
echo   RideDriveAhead - Full-Stack Platform Launcher
echo ========================================================
echo.
echo Starting Live Full-Stack Server, REST API and Database...
echo Simulator URL : http://localhost:3000
echo REST API Base : http://localhost:3000/api/v1
echo Database File : backend\database.json
echo.
echo Press Ctrl+C in this window to stop the server.
echo ========================================================
echo.

start http://localhost:3000
node apps\demo-preview\server.js
pause
