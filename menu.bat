@echo off
color 0A
mode con: cols=100 lines=30
title Gerai Hafizha Database Proxy API - Main Menu

:menu
cls
echo ===================================================
echo    Gerai Hafizha Database Proxy API - Main Menu
echo ===================================================
echo.
echo  [1] Install and Run as Windows Service (Recommended)
echo  [2] Run Manually (For Testing)
echo  [3] Test Proxy API (Command Line)
echo  [4] Test Proxy API (Web Browser)
echo  [5] Update Vercel Backend
echo  [6] Uninstall Windows Service
echo  [7] View Documentation
echo  [8] Exit
echo.
echo ===================================================
echo.

set /p choice=Enter your choice (1-8): 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto run_manually
if "%choice%"=="3" goto test_cli
if "%choice%"=="4" goto test_browser
if "%choice%"=="5" goto update_vercel
if "%choice%"=="6" goto uninstall
if "%choice%"=="7" goto documentation
if "%choice%"=="8" goto exit

echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:install
cls
echo Running install-and-run.bat...
call install-and-run.bat
goto menu

:run_manually
cls
echo Running run-manually.bat...
call run-manually.bat
goto menu

:test_cli
cls
echo Running test-proxy.bat...
call test-proxy.bat
goto menu

:test_browser
cls
echo Opening test page in browser...
call open-test-page.bat
goto menu

:update_vercel
cls
echo Running update-vercel-backend.bat...
call update-vercel-backend.bat
goto menu

:uninstall
cls
echo Running uninstall-service.bat...
call uninstall-service.bat
goto menu

:documentation
cls
echo Opening README.md...
start "" "README.md"
timeout /t 2 >nul
goto menu

:exit
cls
echo Thank you for using Gerai Hafizha Database Proxy API.
echo Goodbye!
timeout /t 2 >nul
exit
