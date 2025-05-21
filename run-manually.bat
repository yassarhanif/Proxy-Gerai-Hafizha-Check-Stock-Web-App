@echo off
echo ===================================================
echo Gerai Hafizha Database Proxy API - Manual Run
echo ===================================================
echo.

echo Step 1: Installing dependencies (if needed)...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error installing dependencies. Please check your Node.js installation.
    pause
    exit /b 1
)
echo Dependencies installed successfully.
echo.

echo Step 2: Building the application (if needed)...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error building the application. Please check the logs.
    pause
    exit /b 1
)
echo Application built successfully.
echo.

echo Step 3: Setting up Tailscale Funnel...
echo Running: tailscale funnel 3002
tailscale funnel 3002
if %ERRORLEVEL% neq 0 (
    echo Warning: Could not set up Tailscale Funnel. Please run 'tailscale funnel 3002' manually.
    echo You can still access the API locally at http://localhost:3002
) else (
    echo Tailscale Funnel set up successfully.
)
echo.

echo Step 4: Starting the proxy API...
echo.
echo The proxy API will now start. Press Ctrl+C to stop it.
echo.
echo Local URL: http://localhost:3002
echo.
echo To check if the API is running, visit:
echo http://localhost:3002/api/database/test-connection
echo.
echo IMPORTANT: Keep this window open while you want the proxy to run.
echo.
echo Press any key to start the proxy...
pause > nul

echo Starting proxy...
call npm start
