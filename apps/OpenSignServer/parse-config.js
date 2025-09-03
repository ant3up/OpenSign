/**
 * Parse Server Configuration with Google OAuth Support
 */

const mountPath = process.env.PARSE_MOUNT || '/parse';
const hostname = process.env.PUBLIC_URL || 'https://opensign-backend.onrender.com';

const googleAuthAdapter = require('./auth/google');

// Debug MongoDB URI
console.log('🔧 Parse Server MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('🔧 Parse Server MongoDB URI format:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'None');

const parseConfig = {
  databaseURI: process.env.MONGODB_URI,
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
    google: googleAuthAdapter
  }
};

module.exports = parseConfig;
