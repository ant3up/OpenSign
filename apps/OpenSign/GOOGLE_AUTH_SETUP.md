# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for OpenSign.

## Prerequisites

1. A Google Cloud Console account
2. Access to create OAuth 2.0 credentials

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application" as the application type
   - Add your domain to "Authorized JavaScript origins":
     - For development: `http://localhost:5173`
     - For production: `https://your-domain.com`
   - Add your redirect URI to "Authorized redirect URIs":
     - For development: `http://localhost:5173`
     - For production: `https://your-domain.com`
5. Copy the Client ID

## Step 2: Configure Environment Variables

Create a `.env` file in the `apps/OpenSign` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

## Step 3: Update Railway Environment Variables

1. Go to your Railway project dashboard
2. Navigate to the frontend service
3. Go to "Variables" tab
4. Add the environment variable:
   - Name: `VITE_GOOGLE_CLIENT_ID`
   - Value: Your Google OAuth Client ID

## Step 4: Configure Parse Server (Backend)

The Parse Server needs to be configured to handle Google authentication. Update your backend configuration to include Google OAuth adapter.

## Step 5: Test the Integration

1. Deploy your application
2. Navigate to the login page
3. Click the "Continue with Google" button
4. Complete the Google OAuth flow
5. Verify that users can sign in with their Google accounts

## Troubleshooting

### Common Issues

1. **"Invalid Client ID" error**
   - Verify your Google OAuth Client ID is correct
   - Ensure the domain is added to authorized origins

2. **"Redirect URI mismatch" error**
   - Check that your redirect URI is exactly as configured in Google Console
   - Include protocol (http/https) and port number if applicable

3. **Parse Server authentication errors**
   - Verify Parse Server is configured with Google OAuth adapter
   - Check server logs for detailed error messages

### Security Notes

- Never commit your Google OAuth Client ID to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor OAuth usage in Google Cloud Console

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Parse Server OAuth Documentation](https://docs.parseplatform.org/parse-server/guide/#oauth-and-3rd-party-authentication)
- [React OAuth Google Documentation](https://www.npmjs.com/package/@react-oauth/google)
