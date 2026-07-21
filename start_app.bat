@echo off
title CFTRI & CUET Exam Prep Dashboard Launcher
echo ===================================================
echo   Starting CFTRI & CUET Exam Prep Dashboard...
echo ===================================================
echo.

echo [1/2] Starting Express API Server on http://localhost:5000...
start "CFTRI Prep Server" cmd /k "cd /d %~dp0server && npm start"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React Vite Client on http://localhost:3000...
start "CFTRI Prep Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ===================================================
echo ✅ Launch completed!
echo - Backend API: http://localhost:5000
echo - Frontend Dashboard: http://localhost:3000
echo ===================================================
pause
