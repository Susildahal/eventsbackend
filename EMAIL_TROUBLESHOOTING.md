# Email Service Troubleshooting Guide for Render Deployment

## Issues Fixed

### 1. **Removed Invalid `from` Property in Transporter Config**
The `from` property was incorrectly placed in the `createTransport()` config. It should only be in individual `mailOptions`.

### 2. **Added Connection Pooling & Timeout Settings**
```javascript
pool: true,
maxConnections: 5,
maxMessages: 100,
connectionTimeout: 60000,
greetingTimeout: 30000,
socketTimeout: 60000
```

### 3. **Added SMTP Connection Verification**
The transporter now verifies the connection on startup and logs any issues.

### 4. **Improved Error Handling**
All email sending operations now have try-catch blocks to prevent application crashes.

## Common Issues on Render

### ⚠️ **Issue 1: Missing Environment Variables**
**Solution:** Ensure these environment variables are set in Render dashboard:
- `SMTP_USER` - Your Brevo SMTP username
- `SMTP_PASS` - Your Brevo SMTP password
- `SMTP_EMAIL` - Your verified sender email

**How to check:**
1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Verify all SMTP variables are present

### ⚠️ **Issue 2: Firewall/Port Blocking**
Render may block certain outbound ports. Brevo uses port 587 (TLS).

**Solution:**
- Use port 587 (current setting) ✅
- Alternatively try port 465 with `secure: true`

### ⚠️ **Issue 3: Brevo Account Issues**

**Check these:**
1. **Sender Email Verified:** Your `SMTP_EMAIL` must be verified in Brevo
2. **Daily Limit:** Free Brevo accounts have a daily sending limit (300 emails/day)
3. **Account Status:** Ensure your Brevo account is active

**Verify in Brevo Dashboard:**
- Login to [Brevo](https://app.brevo.com)
- Check "Senders & IP" → verify your sender email
- Check "Account" → view sending limits

### ⚠️ **Issue 4: DNS Resolution Issues**
Render servers may have DNS issues resolving `smtp-relay.brevo.com`.

**Solution:** Use IP address instead (not recommended but works as fallback):
```javascript
host: "smtp-relay.brevo.com", // Try this first
// OR if DNS fails:
// host: "5.135.57.35", // Brevo's IP (may change)
```

### ⚠️ **Issue 5: Timeout on Render**
Render's free tier may have slower network connections.

**Solution:** Already implemented with increased timeouts:
```javascript
connectionTimeout: 60000,  // 60 seconds
socketTimeout: 60000,      // 60 seconds
```

## Testing Email Functionality

### Test 1: Check Logs on Render
```bash
# View Render logs for SMTP errors
# Look for:
# ✅ "SMTP Server is ready to send emails"
# ❌ "SMTP Connection Error:"
```

### Test 2: Test Locally First
```bash
# Run locally with same .env as production
npm start
```

### Test 3: Send Test Email
Use this endpoint to test:
```javascript
// POST to your forgot password endpoint
{
  "email": "your-test-email@example.com"
}
```

## Debugging Steps

### Step 1: Check Environment Variables
```bash
# In Render shell or add temporary log
console.log("SMTP_USER:", process.env.SMTP_USER ? "SET" : "MISSING");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET" : "MISSING");
console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);
```

### Step 2: Enable Detailed Logging
Add to `nodemiler.js`:
```javascript
const transporter = nodemailer.createTransport({
  // ...existing config
  debug: true, // Enable debug output
  logger: true // Log information in console
});
```

### Step 3: Test SMTP Connection
Create a test endpoint:
```javascript
app.get('/test-email', async (req, res) => {
  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: "your-email@example.com",
      subject: "Test Email",
      text: "Test from Render"
    });
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});
```

## Alternative Email Services

If Brevo continues to have issues on Render, consider:

1. **SendGrid** (Free tier: 100 emails/day)
2. **Mailgun** (Free tier: 100 emails/day)
3. **AWS SES** (Free tier: 62,000 emails/month for EC2)
4. **Resend** (Free tier: 3,000 emails/month)

## Checklist for Render Deployment

- [ ] All environment variables set in Render dashboard
- [ ] Brevo sender email verified
- [ ] Check Brevo account status and limits
- [ ] Review Render logs for SMTP connection success
- [ ] Test email sending after deployment
- [ ] Monitor Render logs for email errors
- [ ] Verify emails not going to spam folder

## Quick Fix Commands

### Restart Render Service
Sometimes a simple restart helps:
1. Go to Render dashboard
2. Click "Manual Deploy" → "Clear build cache & deploy"

### Check Render Logs
```bash
# In Render dashboard
# Logs → Filter for "SMTP" or "Email"
```

## Contact Information

If issues persist:
1. Check Brevo Status: https://status.brevo.com
2. Check Render Status: https://status.render.com
3. Review Brevo SMTP Documentation: https://developers.brevo.com/docs/send-email-with-smtp

## Recent Changes Made

✅ Removed invalid `from` property from transporter config
✅ Added connection pooling for better performance  
✅ Added timeout configurations (60s)
✅ Added SMTP connection verification on startup
✅ Wrapped all `sendMail()` calls in try-catch blocks
✅ Added detailed error logging
✅ Improved `from` field format: `"Events Team" <email@example.com>`

Your email system should now work reliably on Render! 🚀
