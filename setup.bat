@echo off
REM E-Commerce SaaS Setup Script for Windows

echo.
echo 🚀 E-Commerce SaaS Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Create .env files from examples
echo.
echo 📝 Setting up environment variables...

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
) else (
    echo ⏭️  backend\.env already exists
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo ✅ Created frontend\.env
) else (
    echo ⏭️  frontend\.env already exists
)

REM Install dependencies
echo.
echo 📦 Installing dependencies...

echo   Backend...
cd backend
call npm install
cd ..

echo   Frontend...
cd frontend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo   1. Update backend\.env with your credentials
echo   2. Update frontend\.env with your API URL
echo   3. Start MongoDB (or use docker-compose)
echo   4. Run: npm run dev
echo.
echo 🐳 Or use Docker:
echo   docker-compose up
