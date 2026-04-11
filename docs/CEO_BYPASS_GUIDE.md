# 👔 AyuraHealth CEO Bypass Guide

This guide explains how to use the **CEO Bypass** feature to navigate the platform and use the AI assistant without any rate limits or Clerk authentication barriers.

## 1. Set the Server Key
First, you must define a secret key on your server (Vercel or Local).

1. Open your `.env.local` or Vercel Environment Variables.
2. Add a new key:
   ```bash
   CEO_BYPASS_KEY="your-secret-super-key-here"
   ```
3. Restart your dev server (if local) or Redeploy (if Vercel).

## 2. Set the Browser Cookie
To identify yourself as the CEO to the server, you need to set a matching cookie in your browser.

### Option A: Via Browser Console (Recommended)
1. Open AyuraHealth in your browser.
2. Open **Developer Tools** (Right-click > Inspect > Console).
3. Paste and run this command:
   ```javascript
   document.cookie = "ayura_ceo_token=your-secret-super-key-here; path=/; max-age=31536000; SameSite=Lax";
   ```
   *(Replace `your-secret-super-key-here` with the exact key you set in step 1).*

### Option B: Via Application Tab
1. Open **Developer Tools** > **Application** tab.
2. Under **Storage**, expand **Cookies** and select `https://ayurahealth.com`.
3. Add a new row:
   - **Name**: `ayura_ceo_token`
   - **Value**: `your-secret-super-key-here`
   - **Path**: `/`

## 3. What this Bypasses
Once the cookie matches the server key, the following systems will be bypassed for you:

- ✅ **Clerk Authentication**: You can access `/dashboard`, `/profile`, and `/settings` without logging in.
- ✅ **AI Rate Limiting**: You can send unlimited messages to VAIDYA without hitting the 10/min or 30/min limits.
- ✅ **Payment Paywall**: The AI will treat you as a "Premium" user automatically.

---
> [!CAUTION]
> **Security Warning**: Keep your `CEO_BYPASS_KEY` as complex as a password. If someone else gets this key and sets the cookie, they will have full unmetered access to your AI credits.
