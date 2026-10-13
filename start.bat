@echo off
title RideDriveAhead - Interactive Simulator & Preview Server
cls
echo ========================================================
echo   RideDriveAhead - Interactive Preview & Simulator
echo   (For Enterprise Spring Microservices: backend\start-dev.bat)
echo ========================================================
echo.
echo Starting Interactive Simulator & Local API Server...
echo Preview URL   : http://localhost:3000
echo Mock/Demo API : http://localhost:3000/api/v1
echo Local DB File : backend\database.json
echo.
echo Press Ctrl+C in this window to stop the server.
echo ========================================================
echo.

start http://localhost:3000
node apps\demo-preview\server.js
pause
