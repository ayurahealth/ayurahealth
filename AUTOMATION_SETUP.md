# AyuraHealth Automated Security & Payment Monitoring Setup

**Purpose:** Continuous automated security audits and payment flow validation  
**Status:** Ready for Configuration  
**Date:** March 29, 2026

---

## 🤖 Automated Workflows

### 1. Weekly Security Audit
**Schedule:** Every Monday at 2 AM UTC  
**File:** `.github/workflows/security-audit.yml`

**What it does:**
- Runs npm audit to check for vulnerabilities
- Scans for console.log statements
- Checks for hardcoded secrets
- Validates security headers
- Checks API route security
- Runs TypeScript compilation
- Attempts full build

**Output:**
- JSON report saved to `.security-audit-report.json`
- Artifacts stored for 30 days
- Slack notification on failure
- GitHub Actions logs

### 2. Weekly Payment Flow Validation
**Schedule:** Every Wednesday at 3 AM UTC  
**File:** `.github/workflows/payment-flow-test.yml`

**What it does:**
- Builds the application
- Starts the development server
- Tests Stripe endpoint availability
- Tests Razorpay endpoint availability
- Validates input validation
- Checks response formats
- Verifies no console errors exposed
- Validates security headers
- Measures response times
- Tests error handling

**Output:**
- JSON report saved to `.payment-flow-report.json`
- Artifacts stored for 30 days
- Slack notification on success/failure
- GitHub Actions logs

---

## 🔧 Setup Instructions

### Step 1: Add GitHub Secrets

Go to your GitHub repository settings and add these secrets:

```
STRIPE_TEST_SECRET_KEY=sk_test_YOUR_KEY
RAZORPAY_TEST_KEY_ID=rzp_test_YOUR_KEY
RAZORPAY_TEST_KEY_SECRET=YOUR_SECRET
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**How to get these:**

**Stripe Test Keys:**
1. Go to https://dashboard.stripe.com
2. Navigate to Developers → API Keys
3. Copy "Secret key" (starts with `sk_test_`)
4. Add to GitHub Secrets as `STRIPE_TEST_SECRET_KEY`

**Razorpay Test Keys:**
1. Go to https://dashboard.razorpay.com
2. Navigate to Settings → API Keys
3. Copy "Key ID" and "Key Secret"
4. Add to GitHub Secrets

**Slack Webhook:**
1. Go to https://api.slack.com/apps
2. Create new app or select existing
3. Navigate to Incoming Webhooks
4. Create new webhook for your channel
5. Copy webhook URL
6. Add to GitHub Secrets as `SLACK_WEBHOOK_URL`

### Step 2: Enable Workflows

1. Go to your GitHub repository
2. Click "Actions" tab
3. Enable workflows if not already enabled
4. Workflows will run on schedule automatically

### Step 3: Manual Trigger

To test workflows manually:

1. Go to "Actions" tab
2. Select "Weekly Security Audit" or "Weekly Payment Flow Validation"
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow"

---

## 📊 Monitoring Dashboard

### GitHub Actions Dashboard
- **URL:** `https://github.com/YOUR_ORG/ayurahealth/actions`
- **View:** All workflow runs, status, logs
- **Frequency:** Check weekly

### Slack Notifications
- **Channel:** #security-alerts (or your configured channel)
- **Notifications:** 
  - ✅ Security audit passed
  - ❌ Security audit failed
  - ✅ Payment flow tests passed
  - ❌ Payment flow tests failed

### Artifact Storage
- **Location:** GitHub Actions → Artifacts
- **Retention:** 30 days
- **Reports:** 
  - `.security-audit-report.json`
  - `.payment-flow-report.json`

---

## 📈 Metrics Tracked

### Security Audit Metrics
- NPM vulnerabilities count
- Console log occurrences
- Hardcoded secrets found
- Security headers status
- API route security issues
- TypeScript compilation errors
- Build success/failure

### Payment Flow Metrics
- Stripe endpoint response time
- Razorpay endpoint response time
- Input validation status
- Response format validation
- Security headers presence
- Error handling verification
- Invalid tier handling

---

## 🔔 Alert Configuration

### Slack Alert Triggers

**Security Audit Failures:**
- Any vulnerability found
- Console logs detected
- Secrets found in code
- Build failure
- TypeScript errors

**Payment Flow Failures:**
- Endpoint not responding
- Invalid response format
- Missing security headers
- Response time > 5 seconds
- Input validation not working

### Email Notifications (Optional)

To add email notifications:

1. Go to GitHub repository Settings
2. Navigate to Notifications
3. Configure email alerts for workflow failures

---

## 🧪 Testing the Automation

### Test Security Audit Workflow

```bash
# Run manually
node scripts/security-audit.js

# Expected output:
# ✅ NPM Audit: PASS
# ✅ Console Logs: PASS
# ✅ Hardcoded Secrets: PASS
# ✅ Security Headers: PASS
# ✅ API Route Security: PASS
# ✅ TypeScript: PASS
# ✅ Build: PASS
```

### Test Payment Flow Workflow

```bash
# Start dev server
npm run dev

# In another terminal
TEST_URL=http://localhost:3000 node scripts/payment-flow-test.js

# Expected output:
# ✅ Stripe Endpoint Availability: PASS
# ✅ Razorpay Endpoint Availability: PASS
# ✅ Stripe Input Validation: PASS
# ✅ Razorpay Input Validation: PASS
# ✅ Stripe Response Format: PASS
# ✅ Razorpay Response Format: PASS
# ✅ No Console Errors Exposed: PASS
# ✅ Security Headers: PASS
# ✅ Response Time: PASS
# ✅ Invalid Tier Handling: PASS
```

---

## 🚨 Troubleshooting

### Workflows Not Running

**Problem:** Scheduled workflows not triggering

**Solution:**
1. Check GitHub Actions is enabled
2. Verify cron schedule is correct
3. Ensure branch is `main`
4. Check repository has commits in last 60 days

### Slack Notifications Not Sending

**Problem:** No Slack messages received

**Solution:**
1. Verify `SLACK_WEBHOOK_URL` is correct
2. Check webhook is still active in Slack
3. Verify channel permissions
4. Check GitHub Actions logs for errors

### Tests Failing

**Problem:** Audit or payment tests failing

**Solution:**
1. Check recent code changes
2. Review test output in GitHub Actions
3. Download artifact report for details
4. Run tests locally to reproduce
5. Fix issues and commit
6. Re-run workflow

---

## 📋 Maintenance Checklist

### Weekly
- [ ] Review GitHub Actions logs
- [ ] Check Slack notifications
- [ ] Monitor test results

### Monthly
- [ ] Review security audit trends
- [ ] Analyze payment flow metrics
- [ ] Update test cases if needed
- [ ] Review and fix any issues

### Quarterly
- [ ] Audit automation effectiveness
- [ ] Update security checks
- [ ] Review payment gateway changes
- [ ] Plan improvements

---

## 🔄 Continuous Improvement

### Suggested Enhancements

1. **Add Performance Monitoring**
   - Track API response times over time
   - Alert on performance degradation

2. **Add Database Health Checks**
   - Verify database connectivity
   - Check query performance

3. **Add Payment Webhook Validation**
   - Verify webhook signatures
   - Test webhook delivery

4. **Add Uptime Monitoring**
   - Monitor application availability
   - Track downtime incidents

5. **Add Advanced Analytics**
   - Track payment success rates
   - Analyze error patterns
   - Generate trend reports

---

## 📞 Support

### Workflow Issues
- Check GitHub Actions documentation: https://docs.github.com/en/actions
- Review workflow logs in GitHub UI
- Check YAML syntax in `.github/workflows/`

### Script Issues
- Run scripts locally to debug
- Check Node.js version compatibility
- Review script output for errors

### Integration Issues
- Verify all secrets are configured
- Check Slack webhook is active
- Verify GitHub permissions

---

## 📝 Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Mar 29, 2026 | Initial automation setup guide |

---

**Last Updated:** March 29, 2026  
**Next Review:** April 29, 2026  
**Maintained By:** AyuraHealth Team
