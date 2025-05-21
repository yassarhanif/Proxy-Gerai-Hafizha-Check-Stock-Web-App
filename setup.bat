@echo off
color 0A
mode con: cols=100 lines=30
title Gerai Hafizha Database Proxy API - Setup

echo ===================================================
echo    Gerai Hafizha Database Proxy API - Setup
echo ===================================================
echo.
echo Welcome to the Gerai Hafizha Database Proxy API setup!
echo.
echo This script will help you get started with the proxy API.
echo.
echo ===================================================
echo.

echo Step 1: Creating a desktop shortcut...
call create-desktop-shortcut.bat
echo.

echo Step 2: Would you like to install the proxy API as a Windows service now?
echo This will allow the proxy to start automatically when your computer boots.
echo.
set /p install_service=Install as Windows service? (y/n): 

if /i "%install_service%"=="y" (
    echo.
    echo Installing as Windows service...
    call install-and-run.bat
) else (
    echo.
    echo Skipping service installation. You can install it later from the main menu.
)

echo.
echo ===================================================
echo.
echo Setup complete!
echo.
echo You can now use the proxy API by:
echo.
echo 1. Running the "Gerai Hafizha Proxy API" shortcut on your desktop
echo 2. Or running menu.bat in this folder
echo.
echo The main menu provides access to all proxy API functions:
echo - Installing/uninstalling as a Windows service
echo - Running manually
echo - Testing the API
echo - Updating your Vercel backend
echo.
echo ===================================================
echo.
echo Press any key to open the main menu...
pause > nul

call menu.bat
