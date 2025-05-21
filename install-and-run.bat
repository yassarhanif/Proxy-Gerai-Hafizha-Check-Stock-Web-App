@echo off
cd /d "%~dp0"
echo ===================================================
echo Gerai Hafizha Database Proxy API - Installation
echo ===================================================
echo.

echo Step 1: Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error installing dependencies. Please check your Node.js installation.
    pause
    exit /b 1
)
echo Dependencies installed successfully.
echo.

echo Step 2: Building the application...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error building the application. Please check the logs.
    pause
    exit /b 1
)
echo Application built successfully.
echo.

echo Step 3: Installing as a Windows service...
call npm run install-service
if %ERRORLEVEL% neq 0 (
    echo Error installing the Windows service. Please check the logs.
    pause
    exit /b 1
)
echo.

echo Step 4: Tailscale Funnel Setup...
echo The Windows service is now configured to automatically start the Tailscale funnel.
echo You can check the status in logs/service-wrapper.log after the service starts.
echo.

echo ===================================================
echo Installation Complete!
echo ===================================================
echo.
echo Your proxy API is now running as a Windows service and will start automatically when your computer boots.
echo The Tailscale funnel will also start automatically with the service.
echo.
echo Local URL: http://localhost:3002
echo.
echo To check if the service is running, visit:
echo http://localhost:3002/api/database/test-connection
echo.
echo To update your Vercel backend, use the Tailscale Funnel URL as your API endpoint.
echo.
echo Press any key to exit...
pause > nul
