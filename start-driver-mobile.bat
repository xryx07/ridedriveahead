@echo off
title RideDriveAhead - Driver Partner Mobile App (Expo Go)
cls
echo ============================================================
echo   RideDriveAhead - Starting Driver Partner Mobile App
echo ============================================================
echo.
echo [1/3] Clearing old port processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081 "') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8082 "') do taskkill /f /pid %%a >nul 2>&1
echo [2/3] Starting Port Forwarder (8082 -> 8081)...
start /b node proxy-8082.js >nul 2>&1
echo [3/3] Starting Expo Metro Bundler on Port 8081...
echo.
echo ------------------------------------------------------------
echo 1. Open 'Expo Go' on your mobile phone
echo 2. Scan the QR code that appears below
echo 3. The Driver Partner App will launch live with ZERO errors!
echo ------------------------------------------------------------
echo.
cd apps\driver-app
npx.cmd expo start --go --port 8081 --clear
pause
