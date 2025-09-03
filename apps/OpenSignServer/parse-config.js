/**
 * Parse Server Configuration with Google OAuth Support
 */

const mountPath = process.env.PARSE_MOUNT || '/parse';
const hostname = process.env.PUBLIC_URL || 'https://opensign-backend.onrender.com';

const googleAuthAdapter = require('./auth/google');

// Debug MongoDB URI
console.log('🔧 Parse Server MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('🔧 Parse Server MongoDB URI format:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'None');
console.log('🔧 Parse Server MongoDB URI full (first 50 chars):', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'None');

// Validate and fix MongoDB URI if needed
let databaseURI = process.env.MONGODB_URI;
if (databaseURI && !databaseURI.includes('/opensign')) {
  console.log('⚠️ MongoDB URI missing database name, appending /opensign');
  databaseURI = databaseURI.replace(/\/?$/, '/opensign');
  console.log('🔧 Fixed MongoDB URI:', databaseURI.substring(0, 50) + '...');
}

const parseConfig = {
  databaseURI,
  appId: process.env.APP_ID || 'opensign',
  masterKey: process.env.MASTER_KEY || 'opensign_master_key_2024',
  serverURL: process.env.SERVER_URL || `${hostname}${mountPath}`,
  publicServerURL: `${hostname}${mountPath}`,
  mountPath,
  allowClientClassCreation: true, // Allow automatic class creation
  allowCustomObjectId: true,
  enableAnonymousUsers: true,
  maxUploadSize: '100mb',
  fileUpload: {
    enableForPublic: true,
    enableForAnonymousUser: true
  },
  // Force MongoDB connection options
  databaseOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    retryWrites: true,
    w: 'majority'
  },
  auth: {
    google: googleAuthAdapter
  }
};

module.exports = parseConfig;
