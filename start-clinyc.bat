@echo off
echo =================================================
echo           Starting Clinyc User App
echo =================================================
echo.

echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found in PATH
    echo Please make sure Node.js is installed and added to your PATH
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Checking if node_modules exists...
if not exist node_modules (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting Expo development server with cleared cache...
echo.
echo NOTE: If this fails, try running these commands in a new Command Prompt window:
echo   cd %CD%
echo   npx expo start --clear
echo.

rem Set Jest max workers to avoid crashes
set JEST_WORKER_ID=1
set NODE_OPTIONS=--max-old-space-size=4096

rem Clear Metro bundler cache before starting
if exist "%APPDATA%\Expo\metro-cache" (
    echo Clearing Metro cache...
    rd /s /q "%APPDATA%\Expo\metro-cache"
)

rem Use npx to ensure we're using the local installation 
npx expo start --clear

echo.
echo If the app failed to start, please check the error messages above.
pause 