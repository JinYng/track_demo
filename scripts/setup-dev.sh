#!/bin/bash

# AI Genomics Assistant - Development Environment Setup Script

set -e

echo "🚀 Setting up AI Genomics Assistant development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   sudo apt update"
    echo "   sudo apt install docker.io docker-compose"
    echo "   sudo usermod -aG docker \$USER"
    echo "   # Then logout and login again"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it:"
    echo "   sudo apt install docker-compose"
    exit 1
fi

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Build shared packages
echo "🔨 Building shared packages..."
npm run build

# Copy environment variables
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration"
fi

# Start development databases
echo "🗄️  Starting development databases..."
npm run dev:db

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Edit .env file with your configuration"
echo "   2. Run 'npm run dev' to start the development servers"
echo "   3. Open http://localhost:80 in your browser"
echo ""
echo "📚 Available commands:"
echo "   npm run dev          - Start frontend and gateway"
echo "   npm run dev:frontend - Start only frontend"
echo "   npm run dev:backend  - Start only gateway"
echo "   npm run build        - Build all packages"
echo "   npm run lint         - Run linting"
echo "   npm run dev:db       - Start development databases"
echo "   npm run dev:db:down  - Stop development databases"
echo "   npm run docker:up    - Start full Docker environment"
echo "   npm run docker:down  - Stop Docker environment"
echo ""
echo "   Or use make commands:"
echo "   make dev             - Start development servers"
echo "   make build           - Build all packages"
echo "   make help            - Show all available commands"