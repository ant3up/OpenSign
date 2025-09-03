// Google Auth Adapter for Parse Server (v3.x)
// Validates Google ID tokens issued to the configured client ID

const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;

if (!clientId) {
  // Not throwing here to avoid breaking server boot; validation will fail instead
  console.warn('⚠️ GOOGLE_CLIENT_ID is not set; Google auth will fail validation.');
}

async function verifyIdToken(idToken) {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  return ticket.getPayload();
}

module.exports = {
  // Parse Server calls this to validate the token provided by the client
  validateAuthData: async (authData /*, options */) => {
    // Expect authData to include: { id: <google_user_sub>, id_token: <JWT ID token> }
    if (!authData || !authData.id_token) {
      throw new Error('Missing Google id_token');
    }
    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID is not configured on the server');
    }

    const payload = await verifyIdToken(authData.id_token);

    if (!payload || !payload.sub) {
      throw new Error('Invalid Google token payload');
    }

    if (authData.id && authData.id !== payload.sub) {
      throw new Error('Google sub does not match provided id');
    }

    // Validation OK; Parse will proceed with login/link using authData.id as the unique key
    return;
  },

  // Optional for Google; accept any app id list
  validateAppId: async (/* appIds, authData, options */) => {
    return;
  },
};






