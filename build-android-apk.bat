@echo off
title RideDriveAhead - Android APK Builder
cls
echo ============================================================
echo   RideDriveAhead - EAS Mobile APK Builder
echo ============================================================
echo.

if "%EXPO_TOKEN%"=="" set EXPO_TOKEN=Gw3ejcZ0AcRnKWZ6dovowZCpEIsu3ts7WAfHW_LB

echo Connected to Expo Account: aryajain19
echo.
echo Select which app you want to build as an installable APK:
echo.
echo   [1] Rider App (RideDriveAhead - Rider)
echo   [2] Driver Partner App (RideDriveAhead - Driver)
echo   [3] Exit
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" goto BUILD_RIDER
if "%choice%"=="2" goto BUILD_DRIVER
if "%choice%"=="3" goto END
echo Invalid choice.
goto END

:BUILD_RIDER
echo.
echo Starting EAS Cloud Build for Rider App (.apk)...
cd apps\rider-app
npx.cmd eas-cli build -p android --profile preview --non-interactive
goto DONE

:BUILD_DRIVER
echo.
echo Starting EAS Cloud Build for Driver Partner App (.apk)...
cd apps\driver-app
npx.cmd eas-cli build -p android --profile preview --non-interactive
goto DONE

:DONE
echo.
echo ============================================================
echo Build initiated! Check the terminal link above to track or download your APK.
echo ============================================================
pause
:END
