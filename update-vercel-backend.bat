@echo off
echo ===================================================
echo Gerai Hafizha - Update Vercel Backend
echo ===================================================
echo.
echo This script will help you update your Vercel backend to use the proxy API.
echo.

echo Step 1: Get your Tailscale Funnel URL
echo.
echo Run the following command to get your Tailscale Funnel URL:
echo.
echo   tailscale funnel 3002
echo.
set /p funnel_url=Enter your Tailscale Funnel URL (e.g., https://your-machine-name.ts.net:3002): 

if "%funnel_url%"=="" (
    echo Error: You must enter a Funnel URL.
    pause
    exit /b 1
)

echo.
echo Step 2: Test the connection to your proxy API
echo.
echo Testing connection to %funnel_url%...
curl -s %funnel_url%/api/database/test-connection
if %ERRORLEVEL% neq 0 (
    echo.
    echo Warning: Could not connect to the proxy API at %funnel_url%
    echo Please make sure the proxy is running and Tailscale Funnel is set up correctly.
    echo.
    set /p continue=Do you want to continue anyway? (y/n): 
    if /i not "%continue%"=="y" (
        pause
        exit /b 1
    )
) else (
    echo.
    echo Connection to proxy API successful!
)

echo.
echo Step 3: Update your Vercel environment variables
echo.
echo Log in to your Vercel account and go to your project settings.
echo Navigate to the "Environment Variables" section.
echo.
echo Add the following environment variable:
echo.
echo   Name: PROXY_API_URL
echo   Value: %funnel_url%
echo.
echo Then redeploy your Vercel project.
echo.

echo ===================================================
echo Instructions for updating your backend code:
echo ===================================================
echo.
echo 1. Open the file "vercel-backend-update-guide.md" for detailed instructions.
echo 2. Use the example code in "vercel-backend-example.ts" as a reference.
echo.
echo The key change is to replace direct database connections with API calls to:
echo.
echo   %funnel_url%/api/database/test-connection
echo   %funnel_url%/api/products/search
echo.

echo Press any key to open the update guide...
pause > nul
start "" "vercel-backend-update-guide.md"
