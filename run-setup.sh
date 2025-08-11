#!/bin/bash

# FileInASnap Complete Setup Script
# This script executes Steps 1-6 of the setup process

echo "🚀 FileInASnap Complete Setup (Steps 1-6)"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "\n${BLUE}📋 $1${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "frontend" ]] || [[ ! -d "backend" ]]; then
    print_error "Please run this script from the fileinasnap_v2_0-main directory"
    exit 1
fi

print_step "STEP 1-2: Environment & Dependencies Setup"

# Check if .env files exist
if [[ ! -f "frontend/.env" ]]; then
    print_warning "Frontend .env file not found. Please create it with your Supabase credentials:"
    echo "REACT_APP_SUPABASE_URL=your_supabase_url"
    echo "REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key"
fi

if [[ ! -f "backend/.env" ]]; then
    print_warning "Backend .env file not found. Please create it with your Supabase credentials:"
    echo "SUPABASE_URL=your_supabase_url"
    echo "SUPABASE_SERVICE_ROLE=your_service_role_key"
    echo "SUPABASE_JWT_SECRET=your_jwt_secret"
fi

# Install frontend dependencies
print_step "Installing Frontend Dependencies"
cd frontend
if npm install; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Install backend dependencies
print_step "Installing Backend Dependencies"
cd backend
if python -m pip install -r requirements.txt; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    print_warning "Make sure you have Python 3.8+ and pip installed"
fi
cd ..

print_step "STEP 3: Build Test"

# Test frontend build
cd frontend
if npm run build; then
    print_success "Frontend builds successfully"
else
    print_error "Frontend build failed"
fi
cd ..

print_step "STEP 4-5: Database Schema Ready"

if [[ -f "setup-database.sql" ]]; then
    print_success "Enhanced database schema file is ready"
    echo "📄 Schema location: setup-database.sql"
    echo "👉 Next: Copy this content into your Supabase SQL editor"
else
    print_error "Database schema file not found"
fi

print_step "STEP 6: Deployment Configuration"

if [[ -f "frontend/netlify.toml" ]]; then
    print_success "Netlify configuration is ready"
    echo "📄 Config location: frontend/netlify.toml"
    echo "👉 Next: Update YOUR-FASTAPI-HOST with your backend URL"
else
    print_error "Netlify configuration not found"
fi

print_step "Running Complete Validation"

# Run the validation script
if node test-setup.js; then
    print_success "All validation checks completed"
else
    print_error "Some validation checks failed"
fi

echo ""
echo "=========================================="
echo "🎯 MANUAL STEPS REQUIRED:"
echo ""
echo "1. 🗄️ DATABASE SETUP:"
echo "   • Open Supabase SQL Editor"
echo "   • Copy & paste content from setup-database.sql"
echo "   • Run the SQL script"
echo "   • Go to Storage → Create bucket: 'user-files' (private)"
echo ""
echo "2. 🔧 ENVIRONMENT VARIABLES:"
echo "   • Ensure frontend/.env has REACT_APP_SUPABASE_* vars"
echo "   • Ensure backend/.env has SUPABASE_* vars"
echo ""
echo "3. 🚀 START DEVELOPMENT SERVERS:"
echo "   • Terminal 1: cd frontend && npm start"
echo "   • Terminal 2: cd backend && uvicorn main:app --reload --port 8001"
echo ""
echo "4. 🧪 TEST THE FLOW:"
echo "   • Visit http://localhost:3000"
echo "   • Sign in/Sign up"
echo "   • Go to Dashboard"
echo "   • Test file uploads"
echo ""
echo "5. 🌐 FOR DEPLOYMENT:"
echo "   • Update netlify.toml with your FastAPI host"
echo "   • Set environment variables in Netlify"
echo "   • Deploy!"
echo "=========================================="
