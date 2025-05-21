@echo off
cd /d "%~dp0"
echo ===================================================
echo Gerai Hafizha Database Proxy API - Uninstallation
echo ===================================================
echo.

echo Uninstalling Windows service...
echo This will also stop the Tailscale funnel that was started by the service.
call npm run uninstall-service
if %ERRORLEVEL% neq 0 (
    echo Error uninstalling the Windows service. Please check the logs.
    pause
    exit /b 1
)
echo.

echo ===================================================
echo Uninstallation Complete!
echo ===================================================
echo.
echo The Gerai Hafizha Database Proxy API Windows service has been uninstalled.
echo The Tailscale funnel should now be stopped.
echo.
echo Press any key to exit...
pause > nul
