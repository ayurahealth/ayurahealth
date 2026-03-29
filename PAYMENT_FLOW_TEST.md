# AyuraHealth Payment Flow Testing Guide

**Purpose:** Verify that customers who pay receive their service without issues  
**Last Updated:** March 29, 2026

---

## 🧪 Testing Environment Setup

### Stripe Test Mode
- **Public Key:** `pk_test_*` (available in Stripe dashboard)
- **Secret Key:** `sk_test_*` (stored in environment variables)
- **Test Cards:** Use Stripe's test card numbers

### Razorpay Test Mode
- **Key ID:** `rzp_test_*` (available in Razorpay dashboard)
- **Key Secret:** `*` (stored in environment variables)
- **Test Cards:** Use Razorpay's test card numbers

---

## 💳 Stripe Payment Flow Test

### Test Case 1: Successful Premium Monthly Subscription
**Objective:** Verify successful payment and subscription activation

**Steps:**
1. Navigate to pricing page
2. Click "Subscribe" on Premium tier
3. Select "Monthly" billing
4. Enter email: `test@example.com`
5. Click "Proceed to Payment"
6. Use Stripe test card: `4242 4242 4242 4242`
7. Enter any future expiry date and CVC
8. Click "Pay"

**Expected Results:**
- ✅ Payment processed successfully
- ✅ Redirected to success page
- ✅ User email verified
- ✅ Subscription activated in database
- ✅ User can access premium features
- ✅ No console errors visible
- ✅ No sensitive data in browser network tab

### Test Case 2: Failed Payment Handling
**Objective:** Verify proper error handling for failed payments

**Steps:**
1. Navigate to pricing page
2. Click "Subscribe" on Premium Plus tier
3. Select "Annual" billing
4. Enter email: `test@example.com`
5. Click "Proceed to Payment"
6. Use Stripe test card: `4000 0000 0000 0002` (declined card)
7. Click "Pay"

**Expected Results:**
- ✅ Payment declined
- ✅ User shown error message: "Payment processing failed"
- ✅ Redirected to cancel page
- ✅ Subscription NOT activated
- ✅ User can retry payment
- ✅ No console errors exposed

### Test Case 3: Invalid Email Handling
**Objective:** Verify email validation

**Steps:**
1. Navigate to pricing page
2. Click "Subscribe" on Premium tier
3. Enter invalid email: `invalid-email`
4. Click "Proceed to Payment"

**Expected Results:**
- ✅ Email validation error shown
- ✅ Payment form not submitted
- ✅ User can correct email and retry

### Test Case 4: Payment Timeout Handling
**Objective:** Verify timeout error handling

**Steps:**
1. Navigate to pricing page
2. Click "Subscribe" on Premium tier
3. Enter email: `test@example.com`
4. Simulate network timeout (use browser dev tools)
5. Click "Proceed to Payment"

**Expected Results:**
- ✅ Timeout error shown to user
- ✅ User can retry payment
- ✅ No duplicate charges
- ✅ Subscription NOT activated

---

## 💳 Razorpay Payment Flow Test

### Test Case 1: Successful Premium Monthly Subscription
**Objective:** Verify successful Razorpay payment

**Steps:**
1. Navigate to pricing page
2. Click "Subscribe" on Premium tier
3. Select "Monthly" billing
4. Enter email: `test@example.com`
5. Click "Proceed to Payment"
6. Select Razorpay payment method
7. Use Razorpay test card: `4111 1111 1111 1111`
8. Enter any future expiry date and CVV
9. Click "Pay"

**Expected Results:**
- ✅ Payment processed via Razorpay
- ✅ Redirected to success page
- ✅ Subscription activated
- ✅ User can access premium features
- ✅ No console errors

### Test Case 2: Razorpay Payment Failure
**Objective:** Verify Razorpay error handling

**Steps:**
1. Navigate to pricing page
2. Click "Subscribe" on Premium Plus tier
3. Enter email: `test@example.com`
4. Click "Proceed to Payment"
5. Use Razorpay test card: `4000 0000 0000 0002` (declined)
6. Click "Pay"

**Expected Results:**
- ✅ Payment declined by Razorpay
- ✅ Error message shown: "Payment processing failed"
- ✅ Subscription NOT activated
- ✅ User can retry

---

## 🔐 Security Testing

### Test Case 1: No Console Errors Exposed
**Objective:** Verify no sensitive data in browser console

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Complete a payment flow
4. Check console for any error messages

**Expected Results:**
- ✅ No console.error() messages
- ✅ No API keys visible
- ✅ No sensitive error details exposed

### Test Case 2: Network Request Security
**Objective:** Verify API requests are secure

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Complete a payment flow
4. Inspect all network requests

**Expected Results:**
- ✅ All requests use HTTPS
- ✅ No API keys in request headers
- ✅ No sensitive data in request body
- ✅ Responses properly encoded
- ✅ No sensitive data in response body

### Test Case 3: XSS Prevention
**Objective:** Verify XSS protection

**Steps:**
1. Navigate to checkout form
2. Try injecting XSS payload in email field: `<script>alert('XSS')</script>`
3. Submit form

**Expected Results:**
- ✅ Payload sanitized
- ✅ No script executed
- ✅ Error message shown for invalid email

### Test Case 4: CSRF Protection
**Objective:** Verify CSRF token validation

**Steps:**
1. Open checkout form
2. Inspect form for CSRF token
3. Try submitting form with invalid/missing token

**Expected Results:**
- ✅ CSRF token present in form
- ✅ Request rejected if token invalid
- ✅ Error message shown to user

---

## 📊 Load Testing

### Test Case 1: Concurrent Checkout Requests
**Objective:** Verify system handles multiple simultaneous payments

**Steps:**
1. Use load testing tool (e.g., Apache JMeter, k6)
2. Simulate 100 concurrent checkout requests
3. Monitor server response times
4. Check for errors or timeouts

**Expected Results:**
- ✅ All requests processed successfully
- ✅ Response time < 2 seconds
- ✅ No server errors (5xx)
- ✅ No database connection errors
- ✅ No memory leaks

### Test Case 2: API Rate Limiting
**Objective:** Verify rate limiting on payment endpoints

**Steps:**
1. Send 50 requests/second to `/api/stripe/create-checkout-session`
2. Monitor response codes
3. Check for rate limiting headers

**Expected Results:**
- ⏳ Rate limiting implemented
- ✅ Requests throttled after threshold
- ✅ 429 (Too Many Requests) returned
- ✅ Legitimate users not affected

---

## ✅ Post-Payment Verification

### Test Case 1: Subscription Activation
**Objective:** Verify user can access premium features after payment

**Steps:**
1. Complete successful payment
2. Log in with paid user account
3. Navigate to premium features
4. Verify access granted

**Expected Results:**
- ✅ User logged in successfully
- ✅ Premium features visible
- ✅ Free tier features hidden
- ✅ Subscription status shows "Active"

### Test Case 2: Subscription Renewal
**Objective:** Verify automatic subscription renewal

**Steps:**
1. Create subscription with 7-day trial
2. Wait for trial to expire
3. Verify automatic renewal triggered
4. Check payment processed

**Expected Results:**
- ✅ Subscription renewed automatically
- ✅ Payment processed without user action
- ✅ User notified of renewal
- ✅ Subscription status updated

### Test Case 3: Subscription Cancellation
**Objective:** Verify subscription cancellation flow

**Steps:**
1. Log in as paid user
2. Navigate to subscription settings
3. Click "Cancel Subscription"
4. Confirm cancellation

**Expected Results:**
- ✅ Subscription cancelled
- ✅ Premium features disabled
- ✅ User downgraded to free tier
- ✅ Cancellation email sent

---

## 🐛 Bug Report Template

If you find any issues during testing, use this template:

```
**Title:** [Brief description of issue]

**Severity:** [Critical/High/Medium/Low]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots/Logs:**
[Attach relevant screenshots or logs]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Device: [Desktop/Mobile]
```

---

## 📋 Testing Checklist

### Pre-Testing
- [ ] Test environment configured
- [ ] Test credentials available
- [ ] Browser DevTools ready
- [ ] Load testing tools installed
- [ ] Database backed up

### Stripe Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test invalid email
- [ ] Test timeout handling
- [ ] Test all subscription tiers
- [ ] Test monthly and annual billing

### Razorpay Testing
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test invalid email
- [ ] Test timeout handling
- [ ] Test all subscription tiers

### Security Testing
- [ ] No console errors exposed
- [ ] No API keys visible
- [ ] All requests use HTTPS
- [ ] XSS prevention verified
- [ ] CSRF protection verified

### Load Testing
- [ ] Concurrent requests tested
- [ ] Rate limiting verified
- [ ] Server performance acceptable
- [ ] Database handles load

### Post-Payment
- [ ] Subscription activated
- [ ] Premium features accessible
- [ ] Subscription renewal working
- [ ] Cancellation working

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] All tests passed
- [ ] No security vulnerabilities
- [ ] No console errors
- [ ] Load testing completed
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Error tracking configured
- [ ] Payment webhook configured
- [ ] Customer support ready

---

**Document Version:** 1.0  
**Last Updated:** March 29, 2026  
**Next Review:** April 29, 2026
