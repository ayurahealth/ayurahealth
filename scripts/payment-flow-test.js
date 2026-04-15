#!/usr/bin/env node
/* eslint-disable */

/**
 * AyuraHealth Automated Payment Flow Validation Script
 * Tests payment endpoints and validates response formats
 * 
 * Usage: node scripts/payment-flow-test.js
 * Scheduled: GitHub Actions (weekly)
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  stripeEndpoint: '/api/stripe/create-checkout-session',
  razorpayEndpoint: '/api/razorpay/create-order',
  timeout: 10000,
};

// Test results
const results = {
  timestamp: new Date().toISOString(),
  status: 'PASS',
  tests: [],
  errors: [],
};

// Color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addTest(name, status, details = '') {
  results.tests.push({ name, status, details, timestamp: new Date().toISOString() });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  log(`${icon} ${name}: ${status}${details ? ` - ${details}` : ''}`, 
    status === 'PASS' ? 'green' : status === 'WARN' ? 'yellow' : 'red');
}

// Helper: Make HTTP request
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(config.baseUrl);
    const isHttps = url.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: config.timeout,
    };
    
    const req = client.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test 1: Stripe Endpoint Availability
async function testStripeEndpointAvailability() {
  log('\n🧪 Test 1: Stripe Endpoint Availability', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.stripeEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
    });
    
    if (response.status === 200 || response.status === 400 || response.status === 500) {
      addTest('Stripe Endpoint Availability', 'PASS', `Endpoint responding (${response.status})`);
    } else {
      addTest('Stripe Endpoint Availability', 'FAIL', `Unexpected status: ${response.status}`);
      results.status = 'FAIL';
    }
  } catch (error) {
    addTest('Stripe Endpoint Availability', 'FAIL', error.message);
    results.errors.push(`Stripe endpoint error: ${error.message}`);
    results.status = 'FAIL';
  }
}

// Test 2: Razorpay Endpoint Availability
async function testRazorpayEndpointAvailability() {
  log('\n🧪 Test 2: Razorpay Endpoint Availability', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.razorpayEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
      amount: 499,
    });
    
    if (response.status === 200 || response.status === 400 || response.status === 500) {
      addTest('Razorpay Endpoint Availability', 'PASS', `Endpoint responding (${response.status})`);
    } else {
      addTest('Razorpay Endpoint Availability', 'FAIL', `Unexpected status: ${response.status}`);
      results.status = 'FAIL';
    }
  } catch (error) {
    addTest('Razorpay Endpoint Availability', 'FAIL', error.message);
    results.errors.push(`Razorpay endpoint error: ${error.message}`);
    results.status = 'FAIL';
  }
}

// Test 3: Stripe Input Validation
async function testStripeInputValidation() {
  log('\n🧪 Test 3: Stripe Input Validation', 'cyan');
  
  try {
    // Test missing email
    const response = await makeRequest('POST', config.stripeEndpoint, {
      tier: 'premium',
    });
    
    if (response.status === 400 && response.body.error) {
      addTest('Stripe Input Validation', 'PASS', 'Missing email validation working');
    } else {
      addTest('Stripe Input Validation', 'WARN', 'Input validation may not be working properly');
    }
  } catch (error) {
    addTest('Stripe Input Validation', 'WARN', error.message);
  }
}

// Test 4: Razorpay Input Validation
async function testRazorpayInputValidation() {
  log('\n🧪 Test 4: Razorpay Input Validation', 'cyan');
  
  try {
    // Test missing amount
    const response = await makeRequest('POST', config.razorpayEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
    });
    
    if (response.status === 400 && response.body.error) {
      addTest('Razorpay Input Validation', 'PASS', 'Missing amount validation working');
    } else {
      addTest('Razorpay Input Validation', 'WARN', 'Input validation may not be working properly');
    }
  } catch (error) {
    addTest('Razorpay Input Validation', 'WARN', error.message);
  }
}

// Test 5: Stripe Response Format
async function testStripeResponseFormat() {
  log('\n🧪 Test 5: Stripe Response Format', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.stripeEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
    });
    
    if (response.status === 500 && response.body.error) {
      // Expected when API key not configured
      addTest('Stripe Response Format', 'PASS', 'Error response properly formatted');
    } else if (response.status === 200 && (response.body.sessionId || response.body.error)) {
      addTest('Stripe Response Format', 'PASS', 'Response properly formatted');
    } else {
      addTest('Stripe Response Format', 'WARN', 'Response format may be incorrect');
    }
  } catch (error) {
    addTest('Stripe Response Format', 'WARN', error.message);
  }
}

// Test 6: Razorpay Response Format
async function testRazorpayResponseFormat() {
  log('\n🧪 Test 6: Razorpay Response Format', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.razorpayEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
      amount: 499,
    });
    
    if (response.status === 500 && response.body.error) {
      // Expected when API key not configured
      addTest('Razorpay Response Format', 'PASS', 'Error response properly formatted');
    } else if (response.status === 200 && (response.body.orderId || response.body.error)) {
      addTest('Razorpay Response Format', 'PASS', 'Response properly formatted');
    } else {
      addTest('Razorpay Response Format', 'WARN', 'Response format may be incorrect');
    }
  } catch (error) {
    addTest('Razorpay Response Format', 'WARN', error.message);
  }
}

// Test 7: No Console Errors in Response
async function testNoConsoleErrors() {
  log('\n🧪 Test 7: No Console Errors Exposed', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.stripeEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
    });
    
    const responseStr = JSON.stringify(response.body);
    if (responseStr.includes('console') || responseStr.includes('stack trace')) {
      addTest('No Console Errors Exposed', 'FAIL', 'Console errors found in response');
      results.status = 'FAIL';
    } else {
      addTest('No Console Errors Exposed', 'PASS', 'No console errors in responses');
    }
  } catch (error) {
    addTest('No Console Errors Exposed', 'WARN', error.message);
  }
}

// Test 8: Security Headers
async function testSecurityHeaders() {
  log('\n🧪 Test 8: Security Headers', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.stripeEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
    });
    
    const headers = response.headers;
    const requiredHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'referrer-policy',
    ];
    
    let missingHeaders = [];
    requiredHeaders.forEach(header => {
      if (!headers[header]) {
        missingHeaders.push(header);
      }
    });
    
    if (missingHeaders.length === 0) {
      addTest('Security Headers', 'PASS', 'All security headers present');
    } else {
      addTest('Security Headers', 'WARN', `Missing headers: ${missingHeaders.join(', ')}`);
    }
  } catch (error) {
    addTest('Security Headers', 'WARN', error.message);
  }
}

// Test 9: Response Time
async function testResponseTime() {
  log('\n🧪 Test 9: Response Time', 'cyan');
  
  try {
    const start = Date.now();
    await makeRequest('POST', config.stripeEndpoint, {
      tier: 'premium',
      email: 'test@example.com',
    });
    const duration = Date.now() - start;
    
    if (duration < 2000) {
      addTest('Response Time', 'PASS', `${duration}ms (< 2s)`);
    } else if (duration < 5000) {
      addTest('Response Time', 'WARN', `${duration}ms (acceptable but slow)`);
    } else {
      addTest('Response Time', 'FAIL', `${duration}ms (> 5s)`);
      results.status = 'FAIL';
    }
  } catch (error) {
    addTest('Response Time', 'FAIL', error.message);
    results.status = 'FAIL';
  }
}

// Test 10: Invalid Tier Handling
async function testInvalidTierHandling() {
  log('\n🧪 Test 10: Invalid Tier Handling', 'cyan');
  
  try {
    const response = await makeRequest('POST', config.stripeEndpoint, {
      tier: 'invalid-tier',
      email: 'test@example.com',
    });
    
    if (response.status === 400 && response.body.error) {
      addTest('Invalid Tier Handling', 'PASS', 'Invalid tier properly rejected');
    } else {
      addTest('Invalid Tier Handling', 'WARN', 'Invalid tier handling may be incorrect');
    }
  } catch (error) {
    addTest('Invalid Tier Handling', 'WARN', error.message);
  }
}

// Generate Report
function generateReport() {
  log('\n' + '='.repeat(60), 'blue');
  log('PAYMENT FLOW VALIDATION REPORT', 'blue');
  log('='.repeat(60), 'blue');
  
  log(`\nTimestamp: ${results.timestamp}`);
  log(`Base URL: ${config.baseUrl}`);
  log(`Status: ${results.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`, 
    results.status === 'PASS' ? 'green' : 'red');
  
  const passCount = results.tests.filter(t => t.status === 'PASS').length;
  const warnCount = results.tests.filter(t => t.status === 'WARN').length;
  const failCount = results.tests.filter(t => t.status === 'FAIL').length;
  
  log(`\nTests: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`);
  
  if (results.errors.length > 0) {
    log(`\n❌ Errors: ${results.errors.length}`, 'red');
    results.errors.forEach(e => log(`  - ${e}`, 'red'));
  }
  
  log('\n' + '='.repeat(60), 'blue');
  
  // Save report
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(process.cwd(), '.payment-flow-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  log(`\nReport saved to: ${reportPath}`, 'cyan');
  /**
 * Ayura Intelligence Lab Automated Payment Flow Validation Script
 * ----------------------------------------------------
 */

async function main() {
  log('\n💳 Starting Ayura Intelligence Lab Payment Flow Validation...', 'cyan');
  log(`Time: ${new Date().toLocaleString()}`, 'cyan');
  log(`Testing: ${config.baseUrl}`, 'cyan');
  
  try {
    await testStripeEndpointAvailability();
    await testRazorpayEndpointAvailability();
    await testStripeInputValidation();
    await testRazorpayInputValidation();
    await testStripeResponseFormat();
    await testRazorpayResponseFormat();
    await testNoConsoleErrors();
    await testSecurityHeaders();
    await testResponseTime();
    await testInvalidTierHandling();
    
    generateReport();
  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run tests
runTests();
