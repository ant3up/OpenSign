/**
 * Parse Server Configuration with Google OAuth Support
 */

const mountPath = process.env.PARSE_MOUNT || '/parse';
const hostname = process.env.PUBLIC_URL || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:8080');

const parseConfig = {
  databaseURI: process.env.MONGO_URI || process.env.DATABASE_URI || 'mongodb://localhost:27017/opensign',
  appId: process.env.APP_ID || 'opensign',
  masterKey: process.env.MASTER_KEY || 'opensign_master_key_2024',
  serverURL: process.env.SERVER_URL || `${hostname}${mountPath}`,
  publicServerURL: `${hostname}${mountPath}`,
  mountPath,
  allowClientClassCreation: false,
  allowCustomObjectId: true,
  enableAnonymousUsers: true,
  maxUploadSize: '100mb',
  fileUpload: {
    enableForPublic: true,
    enableForAnonymousUser: true
  },
  auth: {
    google: {
      module: './auth/google.js'
    }
  }
};

module.exports = parseConfig;
