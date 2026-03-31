#!/bin/bash

# AyuraHealth - Antigravity Deployment Setup Script
# This script automates the setup process for deploying to Antigravity

set -e

echo "🚀 AyuraHealth - Antigravity Deployment Setup"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git $(git --version | head -n1)${NC}"

echo ""
echo -e "${BLUE}Installing Antigravity CLI...${NC}"
npm install -g @antigravity/cli 2>/dev/null || echo "Antigravity CLI already installed"
echo -e "${GREEN}✓ Antigravity CLI installed${NC}"

echo ""
echo -e "${BLUE}Checking project structure...${NC}"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ package.json found${NC}"

# Check if next.config.ts exists
if [ ! -f "next.config.ts" ]; then
    echo -e "${RED}❌ next.config.ts not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ next.config.ts found${NC}"

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}Building application...${NC}"
npm run build
echo -e "${GREEN}✓ Build successful${NC}"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Create Antigravity account:"
echo "   Visit: https://antigravity.dev"
echo ""
echo "2. Authenticate with Antigravity CLI:"
echo "   antigravity login"
echo ""
echo "3. Set environment variables:"
echo "   antigravity env set NEXT_PUBLIC_RAZORPAY_KEY_ID 'your-key'"
echo "   antigravity env set RAZORPAY_KEY_SECRET 'your-secret'"
echo "   antigravity env set STRIPE_SECRET_KEY 'your-key'"
echo "   antigravity env set DATABASE_URL 'your-database-url'"
echo "   antigravity env set JWT_SECRET 'your-secret'"
echo ""
echo "4. Deploy to Antigravity:"
echo "   antigravity deploy"
echo ""
echo "5. Monitor deployment:"
echo "   antigravity logs --follow"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "For more information, see ANTIGRAVITY_DEPLOYMENT_GUIDE.md"
