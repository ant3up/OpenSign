// Google Auth Adapter for Parse Server (v3.x)
// Validates Google ID tokens issued to the configured client ID

const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;

console.log('🔧 Google OAuth Configuration:');
console.log('🔧 GOOGLE_CLIENT_ID set:', clientId ? 'Yes' : 'No');
console.log('🔧 GOOGLE_CLIENT_ID value:', clientId ? clientId.substring(0, 20) + '...' : 'Not set');

if (!clientId) {
  // Not throwing here to avoid breaking server boot; validation will fail instead
  console.warn('⚠️ GOOGLE_CLIENT_ID is not set; Google auth will fail validation.');
}

async function verifyIdToken(idToken) {
  console.log('🔧 Verifying Google ID token...');
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  console.log('🔧 Google token verified successfully for user:', payload.email);
  return payload;
}

module.exports = {
  // Parse Server calls this to validate the token provided by the client
  validateAuthData: async (authData /*, options */) => {
    console.log('🔧 Google OAuth validateAuthData called with:', JSON.stringify(authData, null, 2));
    
    // Expect authData to include: { id: <google_user_sub>, id_token: <JWT ID token> }
    if (!authData || !authData.id_token) {
      console.error('❌ Google OAuth: Missing id_token in authData');
      throw new Error('Missing Google id_token');
    }
    if (!clientId) {
      console.error('❌ Google OAuth: GOOGLE_CLIENT_ID not configured');
      throw new Error('GOOGLE_CLIENT_ID is not configured on the server');
    }

    try {
      const payload = await verifyIdToken(authData.id_token);

      if (!payload || !payload.sub) {
        console.error('❌ Google OAuth: Invalid token payload');
        throw new Error('Invalid Google token payload');
      }

      if (authData.id && authData.id !== payload.sub) {
        console.error('❌ Google OAuth: Sub mismatch');
        throw new Error('Google sub does not match provided id');
      }

      console.log('✅ Google OAuth validation successful');
      // Validation OK; Parse will proceed with login/link using authData.id as the unique key
      return;
    } catch (error) {
      console.error('❌ Google OAuth validation failed:', error.message);
      throw error;
    }
  },

  // Optional for Google; accept any app id list
  validateAppId: async (/* appIds, authData, options */) => {
    return;
  },
};






