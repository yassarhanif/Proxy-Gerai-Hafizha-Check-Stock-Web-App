@echo off
echo ===================================================
echo Testing Gerai Hafizha Proxy API Service
echo ===================================================
echo.

echo Step 1: Checking if service is installed...
sc query "GeraiHafizhaProxyAPI" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Service is installed.
    sc query "GeraiHafizhaProxyAPI"
) else (
    echo Service is NOT installed.
    echo Please run the install option from menu.bat first.
    pause
    exit /b 1
)
echo.

echo Step 2: Testing API connection...
echo Waiting 5 seconds for API to be ready...
timeout /t 5 >nul

curl -s http://localhost:3002/api/database/test-connection 2>nul
if %ERRORLEVEL% equ 0 (
    echo.
    echo API is responding!
) else (
    echo API is not responding on localhost:3002
    echo.
    echo Checking service logs...
    if exist "logs\service-wrapper.log" (
        echo Last 20 lines from service-wrapper.log:
        echo ----------------------------------------
        powershell "Get-Content 'logs\service-wrapper.log' | Select-Object -Last 20"
    ) else (
        echo No service logs found at logs\service-wrapper.log
    )
)
echo.

echo Step 3: Service status check...
sc query "GeraiHafizhaProxyAPI"
echo.

echo Test complete. Press any key to exit...
pause >nul
