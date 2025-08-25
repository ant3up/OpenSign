/**
 * Parse Server Configuration with Google OAuth Support
 */

const parseConfig = {
  databaseURI: process.env.MONGO_URI || process.env.DATABASE_URI || 'mongodb://localhost:27017/opensign',
  appId: process.env.APP_ID || 'opensign',
  masterKey: process.env.MASTER_KEY || 'opensign_master_key_2024',
  serverURL: process.env.SERVER_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/parse`,
  publicServerURL: process.env.PUBLIC_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`,
  mountPath: process.env.PARSE_MOUNT || '/parse',
  allowClientClassCreation: false,
  allowCustomObjectId: true,
  enableAnonymousUsers: true,
  maxUploadSize: '100mb',
  fileUpload: {
    enableForPublic: true,
    enableForAnonymousUser: true
  },
  // Google OAuth Configuration
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
};

module.exports = parseConfig;
