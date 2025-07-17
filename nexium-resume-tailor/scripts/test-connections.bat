@echo off
echo Testing Database Connections...
echo ===========================

cd /d "%~dp0.."
node scripts/test-connections.js
if errorlevel 1 (
    echo.
    echo One or more connection tests failed.
    exit /b 1
) else (
    echo.
    echo All connection tests passed!
    exit /b 0
)
