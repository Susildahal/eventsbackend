# 🚀 Complete Brevo SMTP Setup Guide for Render

## ⚠️ CRITICAL: Your Issue Found!

**Problem:** Your `.env` had `SMTP_HOST=smtp.gmail.com` but Brevo credentials!
**Fixed:** Changed to `SMTP_HOST=smtp-relay.brevo.com`

---

## 📋 Step-by-Step Brevo Configuration

### Step 1: Login to Brevo
Go to: https://app.brevo.com/

### Step 2: Verify Your Sender Email Address

**THIS IS THE MOST IMPORTANT STEP!** 🔴

1. **Go to:** Settings → Senders & IP
2. **Click:** "Add a new sender"
3. **Enter:** `susildahal234@gmail.com`
4. **Verify:** You'll receive a verification email to this address
5. **Click the verification link** in the email

**❌ If not verified:** Brevo will REJECT all emails (works locally but fails on production)
**✅ If verified:** Shows green checkmark in Brevo dashboard

### Step 3: Get Your SMTP Credentials

1. **Go to:** Settings → SMTP & API
2. **Click:** "SMTP" tab
3. **You'll see:**
   - **SMTP Server:** `smtp-relay.brevo.com`
   - **Port:** `587` (recommended) or `465`
   - **Login:** Your SMTP login (e.g., `9da323001@smtp-brevo.com`)
   - **Password:** Your SMTP key (generate if needed)

### Step 4: Generate New SMTP Key (If Needed)

1. In SMTP & API settings
2. Click "Generate a new SMTP key" or "Create a new key"
3. **Name it:** "Render Production"
4. **Copy the key immediately** (shown only once!)
5. Update your Render environment variables with this new key

### Step 5: Check Sending Limits

**Free Plan Limits:**
- 300 emails per day
- 9,000 emails per month

**To Check:**
1. Go to: Settings → Account
2. Look for "Sending limits"
3. Check if you've hit the daily/monthly limit

---

## 🔧 Render Environment Variables Setup

### Required Variables on Render:

```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=9da323001@smtp-brevo.com
SMTP_PASS=YOUR_ACTUAL_SMTP_KEY_HERE
SMTP_EMAIL=susildahal234@gmail.com
```

### How to Set on Render:

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Click: **"Environment"** tab
4. **Add each variable** (or update existing ones)
5. Click: **"Save Changes"**
6. Render will **automatically redeploy**

---

## 🐛 Common Brevo Issues & Solutions

### Issue 1: "Invalid credentials" or "Authentication failed"

**Causes:**
- Wrong SMTP login/password
- Using old/revoked SMTP key
- Spaces in credentials (copy/paste error)

**Solution:**
1. Generate a **new SMTP key** in Brevo
2. Update Render environment variables
3. Ensure NO spaces before/after credentials

---

### Issue 2: "Sender address rejected" or "5.7.1 error"

**Cause:** Sender email (`susildahal234@gmail.com`) is **NOT verified** in Brevo

**Solution:**
1. Go to Brevo → Settings → Senders & IP
2. Find `susildahal234@gmail.com`
3. If not there, add it
4. Check your Gmail for verification email from Brevo
5. Click verification link
6. Wait 5-10 minutes for propagation

---

### Issue 3: Works locally but NOT on Render

**Causes:**
- Environment variables not set on Render
- Using `.env` values instead of Render env vars
- Sender not verified (Brevo is strict in production)
- IP address rate limiting

**Solution:**
1. **Double-check Render env variables** (most common issue)
2. Verify sender email in Brevo
3. Check Brevo doesn't have IP restrictions
4. Look at Render logs for exact error

---

### Issue 4: "Too many connections" or Rate limit

**Cause:** Hitting Brevo's rate limits

**Solution:**
- Free plan: 300 emails/day
- Check: Brevo Dashboard → Statistics
- Upgrade plan if needed

---

### Issue 5: Emails go to SPAM

**Cause:** Gmail/other providers marking as spam

**Solution:**
1. Add SPF/DKIM records (Brevo → Settings → Senders & IP → Domain Authentication)
2. Ask test users to mark "Not spam"
3. Use professional sender name: `"Events Team" <susildahal234@gmail.com>`

---

## 🧪 Testing Your Configuration

### Test 1: Verify Brevo Connection

Add this test endpoint to your `index.js`:

```javascript
app.get('/test-email-config', async (req, res) => {
  try {
    console.log('Testing email configuration...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***SET***' : 'MISSING');
    
    // Import transporter
    const { default: transporter } = await import('./config/nodemiler.js');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified!');
    
    // Send test email
    const info = await transporter.sendMail({
      from: `"Events Team Test" <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Send to yourself
      subject: "✅ Test Email from Render",
      html: `
        <h2>Email Configuration Test</h2>
        <p>If you receive this, your email setup is working correctly!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `
    });
    
    res.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        email: process.env.SMTP_EMAIL
      }
    });
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
```

### Test 2: Check from Browser

After deploying, visit:
```
https://your-render-app.onrender.com/test-email-config
```

Look for:
- ✅ `"success": true` → Email working!
- ❌ `"error": "..."` → Check the error message

---

## 📊 Brevo Dashboard Checks

### Check 1: Verify Sender Status
**Go to:** Senders & IP
**Look for:** Green checkmark next to `susildahal234@gmail.com`
**If red X:** Click to resend verification email

### Check 2: Check SMTP Logs
**Go to:** Logs → SMTP logs
**Look for:** Recent send attempts and any errors

### Check 3: Check Statistics
**Go to:** Statistics → Email
**Look for:** Delivery rate, bounces, spam reports

---

## 🔐 Security Best Practices

### 1. Never Commit SMTP Credentials
Already in `.gitignore`:
```
.env
```

### 2. Use Different Keys for Dev/Prod
- Create separate SMTP keys in Brevo
- Name them: "Development", "Production"
- Easier to revoke if compromised

### 3. Rotate Keys Regularly
- Generate new SMTP key every 3-6 months
- Update Render environment variables

---

## 🚨 Emergency Checklist

If emails still don't work after fixes:

- [ ] **Sender verified?** Check Brevo → Senders & IP
- [ ] **Correct host?** Must be `smtp-relay.brevo.com`
- [ ] **Correct port?** Must be `587` or `465`
- [ ] **SMTP key valid?** Generate new one in Brevo
- [ ] **Env vars on Render?** Double-check all 5 variables
- [ ] **Daily limit?** Check Brevo statistics
- [ ] **Brevo account active?** Login to verify
- [ ] **Render logs?** Check for specific errors
- [ ] **Test endpoint works?** Try `/test-email-config`

---

## 📞 Support Resources

**Brevo Support:**
- Documentation: https://developers.brevo.com/docs/send-email-with-smtp
- Status Page: https://status.brevo.com
- Support: https://help.brevo.com

**Render Support:**
- Documentation: https://render.com/docs
- Status Page: https://status.render.com
- Community: https://community.render.com

---

## ✅ Final Configuration Summary

**Your `.env` should have:**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=9da323001@smtp-brevo.com
SMTP_PASS=bskp0b3QyNIGtkb  # Or generate new key
SMTP_EMAIL=susildahal234@gmail.com
```

**Your Render Environment should have the same values!**

**MOST IMPORTANT:** 
🔴 Verify `susildahal234@gmail.com` in Brevo Dashboard!

---

Good luck! Your emails should work now. 🚀
