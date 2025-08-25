# 🚀 Complete Google OAuth Setup Guide for OpenSign

This comprehensive guide will walk you through setting up Google OAuth authentication for your OpenSign application.

## 📋 **What's Already Done**

✅ **Frontend Integration Complete:**
- Google OAuth library installed (`@react-oauth/google`)
- Authentication hook updated with Google sign-in support
- Auth page redesigned with Google sign-in button
- Configuration system set up for environment variables
- App wrapped with Google OAuth provider

✅ **Backend Integration Complete:**
- Parse Server configuration updated for Google OAuth
- Separate configuration file created (`parse-config.js`)
- Dependencies installed and ready

## 🔧 **Step 1: Google Cloud Console Setup**

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project" or select an existing one
4. Name it something like "OpenSign OAuth"
5. Click "Create"

### 1.2 Enable Google+ API
1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google+ API" or "Google Identity and Access Management (IAM) API"
4. Click "Enable"

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - **App name:** OpenSign
   - **User support email:** Your email
   - **Developer contact information:** Your email
4. Click "Save and Continue"
5. Skip scopes section, click "Save and Continue"
6. Add test users if needed, click "Save and Continue"
7. Review and click "Back to Dashboard"

### 1.4 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Name: "OpenSign Web Client"
5. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://opensign-production-ee42.up.railway.app
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:5173
   https://opensign-production-ee42.up.railway.app
   ```
7. Click "Create"
8. **Copy the Client ID** (you'll need this for the next step)

## 🔧 **Step 2: Configure Environment Variables**

### 2.1 Local Development
Create a `.env` file in `apps/OpenSign/`:
```env
VITE_GOOGLE_CLIENT_ID=your_copied_client_id_here
```

### 2.2 Railway Production
1. Go to your Railway project dashboard
2. Click on your **frontend service**
3. Go to "Variables" tab
4. Add new variable:
   - **Name:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** Your Google OAuth Client ID
5. Click "Add"

6. Click on your **backend service**
7. Go to "Variables" tab
8. Add these variables:
   - **Name:** `GOOGLE_CLIENT_ID`
   - **Value:** Your Google OAuth Client ID
   
   - **Name:** `GOOGLE_CLIENT_SECRET`
   - **Value:** Your Google OAuth Client Secret (from Google Console)

## 🧪 **Step 3: Test Locally**

### 3.1 Start Development Server
```bash
cd apps/OpenSign
npm run dev
```

### 3.2 Test Google Sign-in
1. Navigate to `http://localhost:5173/auth`
2. Click "Continue with Google"
3. Complete the OAuth flow
4. Check browser console for any errors

## 🚀 **Step 4: Deploy to Railway**

### 4.1 Commit and Push Changes
```bash
git add .
git commit -m "Add Google OAuth support"
git push
```

### 4.2 Monitor Deployment
1. Go to your Railway dashboard
2. Watch the deployment progress
3. Check for any build errors

### 4.3 Test Production
1. Navigate to your production URL
2. Go to the auth page
3. Test Google sign-in flow

## 🔍 **Troubleshooting**

### Common Issues and Solutions

#### Issue 1: "Invalid Client ID"
**Symptoms:** Error in browser console about invalid client ID
**Solution:**
- Verify the Client ID is correct
- Check that your domain is in authorized origins
- Ensure no extra spaces in environment variables

#### Issue 2: "Redirect URI Mismatch"
**Symptoms:** Google OAuth error about redirect URI
**Solution:**
- Double-check redirect URIs in Google Console
- Include protocol (http/https) and port number
- Make sure domain exactly matches

#### Issue 3: Parse Server Authentication Errors
**Symptoms:** Backend errors when trying to authenticate
**Solution:**
- Check Railway logs for detailed error messages
- Verify environment variables are set correctly
- Ensure Parse Server is properly configured

#### Issue 4: Frontend Build Errors
**Symptoms:** Build fails during deployment
**Solution:**
- Check that all dependencies are installed
- Verify environment variables are available during build
- Check for syntax errors in code

### Debug Commands

#### Check Environment Variables
```bash
# Frontend
cd apps/OpenSign
echo $VITE_GOOGLE_CLIENT_ID

# Backend
cd apps/OpenSignServer
echo $GOOGLE_CLIENT_ID
echo $GOOGLE_CLIENT_SECRET
```

#### Test Parse Server Configuration
```bash
cd apps/OpenSignServer
node -e "console.log(require('./parse-config'))"
```

#### Check Railway Logs
1. Go to Railway dashboard
2. Click on your service
3. Go to "Deployments" tab
4. Click on latest deployment
5. Check logs for errors

## 📚 **File Structure**

```
OpenSign/
├── apps/
│   ├── OpenSign/                    # Frontend
│   │   ├── src/
│   │   │   ├── hooks/useAuth.tsx   # Updated with Google OAuth
│   │   │   ├── pages/Auth.tsx      # Google sign-in button
│   │   │   ├── config/auth.ts      # Configuration
│   │   │   └── App.tsx             # OAuth provider wrapper
│   │   ├── package.json            # Google OAuth dependency
│   │   └── .env                    # Local environment variables
│   └── OpenSignServer/             # Backend
│       ├── index.js                # Updated Parse Server config
│       ├── parse-config.js         # OAuth configuration
│       └── package.json            # Dependencies
├── GOOGLE_OAUTH_SETUP_STEPS.md     # Detailed setup steps
├── GOOGLE_OAUTH_SETUP_STEPS.md     # Complete guide
└── setup-google-oauth.js           # Setup script
```

## 🔒 **Security Best Practices**

1. **Environment Variables:** Never commit OAuth credentials to version control
2. **HTTPS Only:** Use HTTPS in production for all OAuth flows
3. **Domain Validation:** Only allow authorized domains in Google Console
4. **Regular Rotation:** Periodically rotate OAuth credentials
5. **Monitoring:** Monitor OAuth usage and errors

## 📞 **Getting Help**

If you encounter issues:

1. **Check Documentation:**
   - [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
   - [Parse Server OAuth Documentation](https://docs.parseplatform.org/parse-server/guide/#oauth-and-3rd-party-authentication)
   - [React OAuth Google Documentation](https://www.npmjs.com/package/@react-oauth/google)

2. **Debug Steps:**
   - Check browser console for frontend errors
   - Check Railway logs for backend errors
   - Verify all environment variables are set
   - Test with a simple OAuth flow first

3. **Common Solutions:**
   - Clear browser cache and cookies
   - Restart development server
   - Redeploy to Railway
   - Double-check Google Console configuration

## 🎉 **Success Checklist**

- [ ] Google OAuth Client ID created
- [ ] Environment variables configured locally
- [ ] Environment variables set in Railway
- [ ] Local development server running
- [ ] Google sign-in button appears on auth page
- [ ] OAuth flow completes successfully
- [ ] User can sign in with Google account
- [ ] Production deployment successful
- [ ] Production OAuth flow works

## 🚀 **Next Steps**

After successful setup:

1. **Customize the UI:** Adjust the Google sign-in button styling
2. **Add Error Handling:** Implement better error messages
3. **User Profile:** Extract and store user profile information
4. **Account Linking:** Allow users to link multiple accounts
5. **Analytics:** Track OAuth usage and success rates

---

**🎉 Congratulations!** Your OpenSign application now supports Google OAuth authentication. Users can sign in with their Google accounts, providing a seamless and secure authentication experience.
