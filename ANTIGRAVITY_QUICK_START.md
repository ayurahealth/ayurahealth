# AyuraHealth - Antigravity Quick Start Guide

## ⚡ 5-Minute Deployment

### Step 1: Install Antigravity CLI (1 min)
```bash
npm install -g @antigravity/cli
```

### Step 2: Authenticate (1 min)
```bash
antigravity login
# Enter your Antigravity API key when prompted
```

### Step 3: Set Environment Variables (1 min)
```bash
antigravity env set NEXT_PUBLIC_RAZORPAY_KEY_ID "your-razorpay-key-id"
antigravity env set RAZORPAY_KEY_SECRET "your-razorpay-secret"
antigravity env set STRIPE_SECRET_KEY "your-stripe-secret"
antigravity env set STRIPE_PUBLISHABLE_KEY "your-stripe-public"
antigravity env set DATABASE_URL "your-database-url"
antigravity env set JWT_SECRET "your-jwt-secret"
antigravity env set NEXT_PUBLIC_API_URL "https://your-antigravity-domain.com"
```

### Step 4: Deploy (2 min)
```bash
cd /home/ubuntu/ayurahealth
antigravity deploy
```

### Step 5: Verify
```bash
# Check deployment status
antigravity status

# View logs
antigravity logs --follow

# Test health endpoint
curl https://your-antigravity-domain.com/api/health
```

---

## 📋 Pre-Deployment Checklist

- [ ] Antigravity account created
- [ ] API key generated and saved
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] All tests pass (`npm run test`)
- [ ] Git changes committed

---

## 🔧 Configuration Files

The following files have been created for Antigravity deployment:

1. **antigravity.json** - Main configuration
2. **.antigravityrc** - Build configuration
3. **Dockerfile** - Container configuration
4. **docker-compose.yml** - Local testing
5. **scripts/setup-antigravity.sh** - Automated setup

---

## 🚀 Deployment Methods

### Method 1: CLI (Recommended)
```bash
antigravity deploy
```

### Method 2: Git Push
```bash
git remote add antigravity https://git.antigravity.dev/your-username/ayurahealth.git
git push antigravity main
```

### Method 3: Docker
```bash
docker build -t ayurahealth:latest .
docker tag ayurahealth:latest registry.antigravity.dev/your-username/ayurahealth:latest
docker push registry.antigravity.dev/your-username/ayurahealth:latest
antigravity deploy --image registry.antigravity.dev/your-username/ayurahealth:latest
```

---

## 📊 Monitoring

### View Logs
```bash
antigravity logs --lines 100
antigravity logs --follow
antigravity logs --level error
```

### Check Metrics
```bash
antigravity metrics
antigravity metrics --metric cpu
antigravity metrics --metric memory
```

### View Deployments
```bash
antigravity deployments:list
antigravity deployments:info <deployment-id>
```

---

## 🔄 Rollback

If something goes wrong:

```bash
# List previous deployments
antigravity deployments:list

# Rollback to previous version
antigravity rollback <deployment-id>

# Verify rollback
antigravity status
```

---

## 🧪 Local Testing with Docker

```bash
# Build and run locally
docker-compose up

# Access application
open http://localhost:3000

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

---

## 🔐 Security

- All secrets are stored securely in Antigravity
- Environment variables are encrypted
- SSL/TLS certificates are automatically managed
- WAF protection is enabled by default
- DDoS protection is enabled by default

---

## 💡 Tips

1. **Use staging first**: Deploy to staging before production
2. **Monitor logs**: Always check logs after deployment
3. **Test payments**: Verify Stripe and Razorpay integration
4. **Set up alerts**: Configure alerts for errors and performance
5. **Backup database**: Regular backups are essential

---

## ❓ Troubleshooting

### Build fails
```bash
antigravity cache:clear
antigravity deploy --no-cache
```

### Environment variables not found
```bash
antigravity env list
antigravity env set VARIABLE_NAME "value"
```

### Database connection error
```bash
antigravity env get DATABASE_URL
antigravity ssh
# Inside SSH: psql $DATABASE_URL -c "SELECT 1"
```

### Payment processing fails
```bash
# Test Stripe
curl -X POST https://your-domain.com/api/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"tier":"premium","email":"test@example.com"}'

# Test Razorpay
curl -X POST https://your-domain.com/api/razorpay/create-order \
  -H "Content-Type: application/json" \
  -d '{"tier":"premium","email":"test@example.com","amount":399,"currency":"INR"}'
```

---

## 📚 Resources

- [Antigravity Documentation](https://docs.antigravity.dev)
- [Antigravity CLI Reference](https://docs.antigravity.dev/cli)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Docker Documentation](https://docs.docker.com)

---

## 🎉 You're Ready!

Your AyuraHealth application is ready for Antigravity deployment!

For detailed information, see **ANTIGRAVITY_DEPLOYMENT_GUIDE.md**
