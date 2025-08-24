console.log('🚀 Starting ultra-minimal server...');

const express = require('express');
const http = require('http');

console.log('✅ Express and HTTP modules loaded');

// Create the most basic Express app possible
const app = express();

// Add basic middleware
app.use(require('cors')());
app.use(require('express').json({ limit: '50mb' }));
app.use(require('express').urlencoded({ limit: '50mb', extended: true }));

console.log('✅ Express app created with middleware');

// Initialize Parse Server
console.log('🔧 Initializing Parse Server...');

const ParseServer = require('parse-server').ParseServer;
const Parse = require('parse/node');

// Parse Server configuration
const api = new ParseServer({
  databaseURI: process.env.DATABASE_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/opensign',
  appId: process.env.APP_ID || 'opensign',
  masterKey: process.env.MASTER_KEY || 'opensign_master_key_2024',
  serverURL: process.env.SERVER_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api/app`,
  publicServerURL: process.env.PUBLIC_URL || `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`,
  mountPath: process.env.PARSE_MOUNT || '/api/app',
  allowClientClassCreation: false,
  allowCustomObjectId: true,
  enableAnonymousUsers: true,
  enableSingleSchemaCache: true,
  maxUploadSize: '100mb',
  fileUpload: {
    enableForPublic: true,
    enableForAnonymousUser: true
  }
});

console.log('✅ Parse Server configured');

// Mount Parse Server
app.use(api);

console.log('✅ Parse Server mounted at /api/app');

// Basic health check endpoints - respond immediately
app.get('/', function (req, res) {
  console.log('📋 Root endpoint accessed');
  res.status(200).send('opensign-server is running !!!');
});

app.get('/health', function (req, res) {
  console.log('🏥 Health check endpoint accessed');
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'opensign-server',
    message: 'Ultra-minimal server is running'
  });
});

app.get('/ping', function (req, res) {
  console.log('🏓 Ping endpoint accessed');
  res.status(200).send('pong');
});

console.log('✅ Routes defined');

// Start the server immediately
const port = process.env.PORT || 8080;
console.log('🔧 Using port:', port);
console.log('🔧 All environment variables:', Object.keys(process.env));
console.log('🔧 PORT from env:', process.env.PORT);
console.log('🔧 RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
console.log('🔧 RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);

const httpServer = http.createServer(app);

console.log('✅ HTTP server created');

httpServer.listen(port, '0.0.0.0', function () {
  console.log('✅ Ultra-minimal OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('🌐 Server bound to all interfaces (0.0.0.0)');
  console.log('🔧 Environment: PORT=' + process.env.PORT + ', NODE_ENV=' + process.env.NODE_ENV);
  
  // Test if server is actually listening
  const address = httpServer.address();
  console.log('🔧 Server address:', address);
  console.log('🔧 Server port:', address.port);
  console.log('🔧 Server family:', address.family);
});

console.log('✅ Server startup initiated');

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

console.log('✅ Signal handlers registered');
