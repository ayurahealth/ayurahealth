# AyuraHealth - Antigravity Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Account Setup](#account-setup)
3. [Project Configuration](#project-configuration)
4. [Environment Variables](#environment-variables)
5. [Deployment Steps](#deployment-steps)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- Antigravity account (https://antigravity.dev)
- Node.js 18+ installed locally
- Git installed
- npm or yarn package manager

### Recommended
- Antigravity CLI installed: `npm install -g @antigravity/cli`
- Docker (for local testing)
- Postman or similar for API testing

---

## Account Setup

### Step 1: Create Antigravity Account
1. Go to https://antigravity.dev
2. Sign up with your email
3. Verify your email address
4. Create your first project

### Step 2: Generate API Keys
1. Go to **Settings → API Keys**
2. Create a new API key
3. Copy and save it securely
4. Note your Project ID

### Step 3: Install Antigravity CLI
```bash
npm install -g @antigravity/cli
```

### Step 4: Authenticate CLI
```bash
antigravity login
# Enter your API key when prompted
```

---

## Project Configuration

### Step 1: Create Antigravity Configuration File

Create `antigravity.json` in your project root:

```json
{
  "projectId": "your-project-id-here",
  "name": "ayurahealth",
  "description": "AI-powered Ayurvedic wellness platform",
  "runtime": "node18",
  "buildCommand": "npm run build",
  "startCommand": "npm start",
  "regions": ["us-east-1", "eu-west-1"],
  "environment": "production",
  "healthCheck": {
    "path": "/api/health",
    "interval": 30,
    "timeout": 5
  },
  "scaling": {
    "minInstances": 1,
    "maxInstances": 10,
    "cpuThreshold": 70,
    "memoryThreshold": 80
  },
  "environment_variables": [
    "NEXT_PUBLIC_RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "DATABASE_URL",
    "JWT_SECRET",
    "NEXT_PUBLIC_API_URL"
  ]
}
```

### Step 2: Create Antigravity Build Configuration

Create `.antigravityrc` in your project root:

```
NODE_ENV=production
NPM_TOKEN=your-npm-token-if-needed
ENABLE_CACHING=true
CACHE_LAYERS=node_modules,build
```

### Step 3: Update package.json Scripts

Ensure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "jest",
    "antigravity:build": "npm run build",
    "antigravity:start": "npm start"
  }
}
```

---

## Environment Variables

### Step 1: Set Up Environment Variables on Antigravity

```bash
antigravity env set NEXT_PUBLIC_RAZORPAY_KEY_ID "your-razorpay-key-id"
antigravity env set RAZORPAY_KEY_SECRET "your-razorpay-secret"
antigravity env set STRIPE_SECRET_KEY "your-stripe-secret"
antigravity env set STRIPE_PUBLISHABLE_KEY "your-stripe-public"
antigravity env set DATABASE_URL "your-database-url"
antigravity env set JWT_SECRET "your-jwt-secret"
antigravity env set NEXT_PUBLIC_API_URL "https://your-antigravity-domain.com"
```

### Step 2: Verify Environment Variables

```bash
antigravity env list
```

### Step 3: Create Local .env.local

Create `.env.local` for local testing:

```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PUBLISHABLE_KEY=your-stripe-public
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Deployment Steps

### Step 1: Prepare Your Code

```bash
cd /home/ubuntu/ayurahealth

# Ensure all changes are committed
git add -A
git commit -m "Prepare for Antigravity deployment"

# Verify build works locally
npm run build
```

### Step 2: Create Antigravity Project

```bash
# Initialize Antigravity project
antigravity projects:create ayurahealth

# Or if project already exists
antigravity projects:select ayurahealth
```

### Step 3: Deploy to Antigravity

**Option A: Using CLI**
```bash
antigravity deploy
```

**Option B: Using Git Integration**
```bash
# Add Antigravity remote
git remote add antigravity https://git.antigravity.dev/your-username/ayurahealth.git

# Push to deploy
git push antigravity main
```

**Option C: Using Docker**
```bash
# Build Docker image
docker build -t ayurahealth:latest .

# Push to Antigravity registry
docker tag ayurahealth:latest registry.antigravity.dev/your-username/ayurahealth:latest
docker push registry.antigravity.dev/your-username/ayurahealth:latest

# Deploy
antigravity deploy --image registry.antigravity.dev/your-username/ayurahealth:latest
```

### Step 4: Monitor Deployment

```bash
# Watch deployment logs
antigravity logs --follow

# Check deployment status
antigravity deployments:list

# Get deployment details
antigravity deployments:info <deployment-id>
```

---

## Verification

### Step 1: Check Deployment Status

```bash
antigravity status
```

### Step 2: Test API Endpoints

```bash
# Get your Antigravity domain
antigravity domains:list

# Test health endpoint
curl https://your-antigravity-domain.com/api/health

# Test payment endpoints
curl -X POST https://your-antigravity-domain.com/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"tier":"premium","email":"test@example.com"}'
```

### Step 3: Verify Database Connection

```bash
# SSH into your Antigravity instance
antigravity ssh

# Test database connection
npm run test:db
```

### Step 4: Check Logs

```bash
# View application logs
antigravity logs --lines 100

# View error logs
antigravity logs --level error

# View specific service logs
antigravity logs --service payment
```

---

## Troubleshooting

### Build Failures

**Error: "npm install failed"**
```bash
# Clear cache and retry
antigravity cache:clear
antigravity deploy --no-cache
```

**Error: "Node version mismatch"**
```bash
# Check Node version
node --version

# Update antigravity.json
# Change "runtime": "node18" to match your version
```

### Deployment Issues

**Error: "Environment variables not found"**
```bash
# Verify variables are set
antigravity env list

# Set missing variables
antigravity env set VARIABLE_NAME "value"
```

**Error: "Database connection failed"**
```bash
# Verify DATABASE_URL
antigravity env get DATABASE_URL

# Test connection
antigravity ssh
# Inside SSH: psql $DATABASE_URL -c "SELECT 1"
```

### Performance Issues

**Slow response times**
```bash
# Check resource usage
antigravity metrics

# Increase instance size
antigravity scale --memory 2048 --cpu 2

# Enable caching
antigravity cache:enable
```

**High memory usage**
```bash
# Check memory leaks
antigravity logs --level warn

# Restart instances
antigravity restart

# Increase max instances
antigravity scale --max-instances 20
```

### Payment Integration Issues

**Stripe webhook failures**
```bash
# Update webhook URL
antigravity env set STRIPE_WEBHOOK_URL "https://your-antigravity-domain.com/api/webhooks/stripe"

# Test webhook
curl -X POST https://your-antigravity-domain.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: test" \
  -d '{"type":"payment_intent.succeeded"}'
```

**Razorpay order creation fails**
```bash
# Verify Razorpay keys
antigravity env get RAZORPAY_KEY_SECRET

# Test Razorpay API
curl -X POST https://your-antigravity-domain.com/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"tier":"premium","email":"test@example.com","amount":399,"currency":"INR"}'
```

---

## Advanced Configuration

### Custom Domain

```bash
# Add custom domain
antigravity domains:add yourdomain.com

# Verify DNS records
antigravity domains:verify yourdomain.com

# Set as primary
antigravity domains:set-primary yourdomain.com
```

### SSL/TLS Certificate

```bash
# Antigravity automatically provides SSL
# Verify certificate
antigravity ssl:status

# Renew certificate (if needed)
antigravity ssl:renew
```

### Database Backups

```bash
# Create backup
antigravity backups:create

# List backups
antigravity backups:list

# Restore from backup
antigravity backups:restore <backup-id>
```

### Monitoring & Alerts

```bash
# Set up monitoring
antigravity monitoring:enable

# Create alert
antigravity alerts:create --metric cpu --threshold 80 --action email

# View alerts
antigravity alerts:list
```

---

## Rollback Procedure

### If Deployment Fails

```bash
# List previous deployments
antigravity deployments:list

# Rollback to previous version
antigravity rollback <deployment-id>

# Verify rollback
antigravity status
```

---

## Support & Resources

- **Antigravity Docs:** https://docs.antigravity.dev
- **Antigravity CLI Help:** `antigravity --help`
- **Support Email:** support@antigravity.dev
- **Community Slack:** https://antigravity.slack.com

---

## Next Steps

1. ✅ Create Antigravity account
2. ✅ Generate API keys
3. ✅ Set up environment variables
4. ✅ Deploy using CLI or Git
5. ✅ Verify deployment
6. ✅ Test payment flows
7. ✅ Set up monitoring
8. ✅ Configure custom domain

---

**Deployment Complete! 🎉**

Your AyuraHealth application is now running on Antigravity!
