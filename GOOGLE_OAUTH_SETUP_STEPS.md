# Complete Google OAuth Setup Guide for OpenSign

## 🚀 **Step 1: Google Cloud Console Setup**

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

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: "OpenSign"
   - User support email: Your email
   - Developer contact information: Your email
   - Save and Continue through all steps

### 1.4 Configure OAuth Client
1. Application type: **Web application**
2. Name: "OpenSign Web Client"
3. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://your-railway-domain.up.railway.app
   ```
4. **Authorized redirect URIs:**
   ```
   http://localhost:5173
   https://your-railway-domain.up.railway.app
   ```
5. Click "Create"
6. **Copy the Client ID** (you'll need this for the next step)

## 🔧 **Step 2: Configure Environment Variables**

### 2.1 Local Development
Create a `.env` file in `apps/OpenSign/`:
```env
VITE_GOOGLE_CLIENT_ID=your_copied_client_id_here
```

### 2.2 Railway Production
1. Go to your Railway project dashboard
2. Click on your frontend service
3. Go to "Variables" tab
4. Add new variable:
   - **Name:** `VITE_GOOGLE_CLIENT_ID`
   - **Value:** Your Google OAuth Client ID
5. Click "Add"

## 🔧 **Step 3: Configure Parse Server Backend**

### 3.1 Update Parse Server Configuration
You need to configure your Parse Server to handle Google OAuth. This requires updating your backend configuration.

### 3.2 Install Parse Server OAuth Adapter
In your backend project (`apps/OpenSignServer/`), you may need to install:
```bash
npm install parse-server-google-auth
```

### 3.3 Update Backend Configuration
Update your Parse Server configuration to include Google OAuth support.

## 🧪 **Step 4: Test the Integration**

### 4.1 Local Testing
1. Start your development server:
   ```bash
   cd apps/OpenSign
   npm run dev
   ```
2. Navigate to `http://localhost:5173/auth`
3. Click "Continue with Google"
4. Complete the OAuth flow

### 4.2 Production Testing
1. Deploy to Railway
2. Navigate to your production URL
3. Test the Google sign-in flow

## 🔍 **Troubleshooting Common Issues**

### Issue 1: "Invalid Client ID"
- Verify the Client ID is correct
- Check that your domain is in authorized origins
- Ensure no extra spaces in the environment variable

### Issue 2: "Redirect URI Mismatch"
- Double-check the redirect URIs in Google Console
- Include protocol (http/https) and port number
- Make sure the domain exactly matches

### Issue 3: Parse Server Errors
- Check server logs for detailed error messages
- Verify Parse Server is configured for Google OAuth
- Ensure the backend can handle OAuth authentication

## 📋 **Security Checklist**

- [ ] Google OAuth Client ID is in environment variables
- [ ] Client ID is not committed to version control
- [ ] Authorized origins are properly configured
- [ ] Redirect URIs are secure (HTTPS in production)
- [ ] Parse Server is configured for OAuth
- [ ] Error handling is implemented
- [ ] User data is properly validated

## 🎯 **Next Steps After Setup**

1. **Test User Registration**: Verify new users can sign up with Google
2. **Test User Login**: Verify existing users can sign in with Google
3. **Test Account Linking**: Verify users can link Google accounts to existing accounts
4. **Monitor Logs**: Check for any authentication errors
5. **User Experience**: Ensure the flow is smooth and intuitive

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for errors
2. Check Railway logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure Google Console configuration is accurate
