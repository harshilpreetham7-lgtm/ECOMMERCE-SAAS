#!/bin/bash

# E-Commerce SaaS Setup Script

echo "🚀 E-Commerce SaaS Setup Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Create .env files from examples
echo ""
echo "📝 Setting up environment variables..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "⏭️  backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "⏭️  frontend/.env already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

echo "  → Backend..."
cd backend
npm install
cd ..

echo "  → Frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Update backend/.env with your credentials"
echo "  2. Update frontend/.env with your API URL"
echo "  3. Start MongoDB (or use docker-compose)"
echo "  4. Run: npm run dev"
echo ""
echo "🐳 Or use Docker:"
echo "  docker-compose up"
