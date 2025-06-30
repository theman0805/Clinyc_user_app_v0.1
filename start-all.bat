@echo off
echo =================================================
echo      Starting Clinyc App + MCP Server
echo =================================================
echo.

echo Starting MCP Server in background...
start "MCP Server" cmd /c "start-mcp.bat"

echo Waiting 3 seconds for MCP server to initialize...
timeout /t 3 /nobreak >nul

echo Starting Expo Development Server...
echo.
start "Expo Server" cmd /c "start-expo.bat"

echo.
echo Both services are starting up...
echo - MCP Server window will open separately
echo - Expo Server window will open separately
echo.
echo Press any key to close this launcher...
pause >nul