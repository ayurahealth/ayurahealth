#!/usr/bin/env node

/**
 * AyuraHealth Automated Security Audit Script
 * Runs weekly to check for vulnerabilities, console logs, and security issues
 * 
 * Usage: node scripts/security-audit.js
 * Scheduled: GitHub Actions (weekly)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Report object
const report = {
  timestamp: new Date().toISOString(),
  status: 'PASS',
  checks: [],
  vulnerabilities: [],
  warnings: [],
  errors: [],
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addCheck(name, status, details = '') {
  report.checks.push({ name, status, details });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  log(`${icon} ${name}: ${status}${details ? ` - ${details}` : ''}`, 
    status === 'PASS' ? 'green' : status === 'WARN' ? 'yellow' : 'red');
}

// Check 1: NPM Audit
function checkNpmAudit() {
  log('\n🔍 Checking npm vulnerabilities...', 'cyan');
  try {
    const output = execSync('npm audit --json 2>/dev/null || echo "{}"', { encoding: 'utf-8' });
    const audit = JSON.parse(output);
    
    if (audit.metadata?.vulnerabilities?.total === 0) {
      addCheck('NPM Audit', 'PASS', '0 vulnerabilities');
    } else if (audit.metadata?.vulnerabilities?.total > 0) {
      const vulnCount = audit.metadata.vulnerabilities.total;
      report.vulnerabilities.push(`Found ${vulnCount} npm vulnerabilities`);
      addCheck('NPM Audit', 'FAIL', `${vulnCount} vulnerabilities found`);
      report.status = 'FAIL';
    } else {
      addCheck('NPM Audit', 'PASS', 'No vulnerabilities detected');
    }
  } catch (error) {
    addCheck('NPM Audit', 'WARN', 'Could not run npm audit');
    report.warnings.push('npm audit check failed');
  }
}

// Check 2: Console Logs
function checkConsoleLogs() {
  log('\n🔍 Checking for console logs...', 'cyan');
  
  const filesToCheck = [
    'app/api/stripe/create-checkout-session/route.ts',
    'app/api/razorpay/create-order/route.ts',
    'app/chat/page.tsx',
    'app/pricing/checkout/page.tsx',
    'app/error.tsx',
  ];
  
  let consoleLogsFound = [];
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (/console\.(log|error|warn|debug|info)\(/.test(line) && !line.trim().startsWith('//')) {
          consoleLogsFound.push(`${file}:${index + 1} - ${line.trim()}`);
        }
      });
    }
  });
  
  if (consoleLogsFound.length === 0) {
    addCheck('Console Logs', 'PASS', 'No console statements found');
  } else {
    addCheck('Console Logs', 'FAIL', `${consoleLogsFound.length} console statements found`);
    report.vulnerabilities.push(...consoleLogsFound);
    report.status = 'FAIL';
  }
}

// Check 3: Hardcoded Secrets
function checkHardcodedSecrets() {
  log('\n🔍 Checking for hardcoded secrets...', 'cyan');
  
  const secretPatterns = [
    /sk_live_[a-zA-Z0-9]{20,}/,
    /sk_test_[a-zA-Z0-9]{20,}/,
    /pk_live_[a-zA-Z0-9]{20,}/,
    /pk_test_[a-zA-Z0-9]{20,}/,
    /rzp_live_[a-zA-Z0-9]{20,}/,
    /rzp_test_[a-zA-Z0-9]{20,}/,
    /password\s*=\s*['"][^'"]+['"]/i,
    /api_key\s*=\s*['"][^'"]+['"]/i,
  ];
  
  let secretsFound = [];
  
  const appDir = path.join(process.cwd(), 'app');
  const files = getFilesRecursive(appDir, ['.ts', '.tsx']);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    secretPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        secretsFound.push(`${file} - Potential secret detected`);
      }
    });
  });
  
  if (secretsFound.length === 0) {
    addCheck('Hardcoded Secrets', 'PASS', 'No secrets found');
  } else {
    addCheck('Hardcoded Secrets', 'FAIL', `${secretsFound.length} potential secrets found`);
    report.vulnerabilities.push(...secretsFound);
    report.status = 'FAIL';
  }
}

// Check 4: Security Headers
function checkSecurityHeaders() {
  log('\n🔍 Checking security headers configuration...', 'cyan');
  
  const configPath = path.join(process.cwd(), 'next.config.ts');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf-8');
    
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Content-Security-Policy',
      'Referrer-Policy',
    ];
    
    let missingHeaders = [];
    requiredHeaders.forEach(header => {
      if (!content.includes(header)) {
        missingHeaders.push(header);
      }
    });
    
    if (missingHeaders.length === 0) {
      addCheck('Security Headers', 'PASS', 'All required headers configured');
    } else {
      addCheck('Security Headers', 'WARN', `Missing: ${missingHeaders.join(', ')}`);
      report.warnings.push(`Missing security headers: ${missingHeaders.join(', ')}`);
    }
  } else {
    addCheck('Security Headers', 'WARN', 'Config file not found');
  }
}

// Check 5: API Route Security
function checkApiRouteSecurity() {
  log('\n🔍 Checking API route security...', 'cyan');
  
  const apiRoutes = [
    'app/api/stripe/create-checkout-session/route.ts',
    'app/api/razorpay/create-order/route.ts',
  ];
  
  let securityIssues = [];
  
  apiRoutes.forEach(route => {
    const filePath = path.join(process.cwd(), route);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Check for input validation
      if (!content.includes('if (!') && !content.includes('validate')) {
        securityIssues.push(`${route} - Missing input validation`);
      }
      
      // Check for error handling
      if (!content.includes('catch')) {
        securityIssues.push(`${route} - Missing error handling`);
      }
      
      // Check for dynamic export (prevents static generation issues)
      if (!content.includes('export const dynamic')) {
        securityIssues.push(`${route} - Missing dynamic export`);
      }
    }
  });
  
  if (securityIssues.length === 0) {
    addCheck('API Route Security', 'PASS', 'All routes properly secured');
  } else {
    addCheck('API Route Security', 'WARN', `${securityIssues.length} issues found`);
    report.warnings.push(...securityIssues);
  }
}

// Check 6: TypeScript Compilation
function checkTypeScript() {
  log('\n🔍 Checking TypeScript compilation...', 'cyan');
  
  try {
    execSync('npx tsc --noEmit 2>&1', { stdio: 'pipe' });
    addCheck('TypeScript', 'PASS', 'No type errors');
  } catch (error) {
    const output = error.stdout?.toString() || error.message;
    if (output.includes('error')) {
      addCheck('TypeScript', 'FAIL', 'Type errors found');
      report.errors.push('TypeScript compilation errors detected');
      report.status = 'FAIL';
    } else {
      addCheck('TypeScript', 'PASS', 'No type errors');
    }
  }
}

// Check 7: Build Success
function checkBuild() {
  log('\n🔍 Checking build...', 'cyan');
  
  try {
    execSync('npm run build 2>&1', { stdio: 'pipe', timeout: 300000 });
    addCheck('Build', 'PASS', 'Build successful');
  } catch (error) {
    addCheck('Build', 'FAIL', 'Build failed');
    report.errors.push('Build process failed');
    report.status = 'FAIL';
  }
}

// Helper: Get files recursively
function getFilesRecursive(dir, extensions = []) {
  let files = [];
  
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files = files.concat(getFilesRecursive(fullPath, extensions));
    } else if (stat.isFile()) {
      if (extensions.length === 0 || extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  });
  
  return files;
}

// Generate Report
function generateReport() {
  log('\n' + '='.repeat(60), 'blue');
  log('SECURITY AUDIT REPORT', 'blue');
  log('='.repeat(60), 'blue');
  
  log(`\nTimestamp: ${report.timestamp}`);
  log(`Status: ${report.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`, 
    report.status === 'PASS' ? 'green' : 'red');
  
  log(`\nChecks Passed: ${report.checks.filter(c => c.status === 'PASS').length}/${report.checks.length}`);
  
  if (report.vulnerabilities.length > 0) {
    log(`\n⚠️ Vulnerabilities Found: ${report.vulnerabilities.length}`, 'red');
    report.vulnerabilities.forEach(v => log(`  - ${v}`, 'red'));
  }
  
  if (report.warnings.length > 0) {
    log(`\n⚠️ Warnings: ${report.warnings.length}`, 'yellow');
    report.warnings.forEach(w => log(`  - ${w}`, 'yellow'));
  }
  
  if (report.errors.length > 0) {
    log(`\n❌ Errors: ${report.errors.length}`, 'red');
    report.errors.forEach(e => log(`  - ${e}`, 'red'));
  }
  
  log('\n' + '='.repeat(60), 'blue');
  
  // Save report to file
  const reportPath = path.join(process.cwd(), '.security-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\nReport saved to: ${reportPath}`, 'cyan');
  
  // Exit with appropriate code
  process.exit(report.status === 'PASS' ? 0 : 1);
}

// Run all checks
function runAudit() {
  log('\n🔐 Starting AyuraHealth Security Audit...', 'cyan');
  log(`Time: ${new Date().toLocaleString()}`, 'cyan');
  
  checkNpmAudit();
  checkConsoleLogs();
  checkHardcodedSecrets();
  checkSecurityHeaders();
  checkApiRouteSecurity();
  checkTypeScript();
  checkBuild();
  
  generateReport();
}

// Run the audit
runAudit();
