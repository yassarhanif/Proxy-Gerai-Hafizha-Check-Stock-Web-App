@echo off
echo ===================================================
echo Gerai Hafizha Database Proxy API - Test Script
echo ===================================================
echo.

set API_URL=http://localhost:3002

echo Testing connection to proxy API...
curl -s %API_URL%
if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Could not connect to the proxy API at %API_URL%
    echo Please make sure the proxy is running.
    pause
    exit /b 1
)
echo.
echo Proxy API is running.
echo.

echo Testing database connection...
curl -s %API_URL%/api/database/test-connection
echo.
echo.

echo Testing product search by name...
set /p search_term=Enter a product name to search for (or press Enter to use "test"): 
if "%search_term%"=="" set search_term=test
echo.
echo Searching for products with name containing "%search_term%"...
curl -s "%API_URL%/api/products/search?name=%search_term%"
echo.
echo.

echo Testing product search by barcode...
set /p barcode=Enter a barcode to search for (or press Enter to skip): 
if not "%barcode%"=="" (
    echo.
    echo Searching for product with barcode "%barcode%"...
    curl -s "%API_URL%/api/products/search?barcode=%barcode%"
    echo.
    echo.
)

echo ===================================================
echo Testing Complete!
echo ===================================================
echo.
echo If you saw JSON responses above, your proxy API is working correctly.
echo.
echo To test the Tailscale Funnel URL, replace "http://localhost:3002" with your Funnel URL.
echo.
echo Press any key to exit...
pause > nul
