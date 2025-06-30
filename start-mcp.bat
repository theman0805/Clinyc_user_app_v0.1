@echo off
echo =================================================
echo           Starting Supabase MCP Server
echo =================================================
echo.
echo Preparing environment for MCP server...
echo.

rem Temporarily rename .env to prevent auto-loading
if exist .env (
    ren .env .env.temp
    echo Temporarily renamed .env to .env.temp
)

rem Clear any existing environment variables that might conflict
set EXPO_PUBLIC_SUPABASE_URL=
set EXPO_PUBLIC_SUPABASE_KEY=

rem Set environment variables from .env.mcp
set SUPABASE_PROJECT_REF=dgbauvfjeceazjnngire
set SUPABASE_DB_PASSWORD=q9ByzX1BXCDpT0SH
set SUPABASE_REGION=ap-south-1
set SUPABASE_ACCESS_TOKEN=sbp_4940296ca8fe29627a1ef88ad609f85707fd3c37
set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYmF1dmZqZWNlYXpqbm5naXJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTM5OTE3NiwiZXhwIjoyMDYwOTc1MTc2fQ.fN4iCOdT-mmaq6xeybwPpiqf6tgjx7dSh6figJJBPvw
set QUERY_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnYmF1dmZqZWNlYXpqbm5naXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzOTkxNzYsImV4cCI6MjA2MDk3NTE3Nn0.wj7KiqIyoKWCgbliMrIk29dzbBtA_xhv1I5_jQ9dXz4

echo Starting MCP server...
echo.

rem Execute the server
call .\.venv\Scripts\supabase-mcp-server.exe --project-ref %SUPABASE_PROJECT_REF%

rem Restore .env file
if exist .env.temp (
    ren .env.temp .env
    echo Restored .env file
)

pause