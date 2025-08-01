#!/bin/bash

# FileInASnap - BMAD Orchestrator Startup Script
# This script initializes the AI agent system and runs the full orchestration pipeline

echo "🚀 Starting FileInASnap BMAD Orchestrator..."
echo "================================================"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ to continue."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION found. Requires $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Set environment variables
export NODE_ENV=${NODE_ENV:-development}
export LOG_LEVEL=${LOG_LEVEL:-info}

echo "🔧 Environment: $NODE_ENV"
echo "📊 Log Level: $LOG_LEVEL"

# Parse command line arguments
PLAN=${1:-standard}
COMMAND=${2:-build-all}

echo "📋 Plan: $PLAN"
echo "⚡ Command: $COMMAND"
echo "================================================"

# Run the BMAD orchestrator
if [ "$COMMAND" = "build-all" ]; then
    echo "🤖 Running full agent orchestration pipeline..."
    npm run start -- --plan=$PLAN
elif [ "$COMMAND" = "dev" ]; then
    echo "🔄 Running in development mode with hot reload..."
    npm run dev -- --plan=$PLAN
else
    echo "🎯 Running specific command: $COMMAND"
    npm run agent:$COMMAND -- --plan=$PLAN
fi

# Check exit status
if [ $? -eq 0 ]; then
    echo "================================================"
    echo "✅ FileInASnap orchestration completed successfully!"
    echo "📱 Access your dashboard at: http://localhost:3000"
    echo "🔗 API endpoints available at: http://localhost:8001/api"
else
    echo "================================================"
    echo "❌ Orchestration failed. Check logs above for details."
    exit 1
fi