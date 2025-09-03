console.log('🚀 Starting Express server...');

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

console.log('✅ Express, CORS, and MongoDB modules loaded');

// Create Express app
const app = express();
// Trust proxy for correct host/origin handling behind Railway
app.set('trust proxy', 1);

// Add middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log('✅ Express app created with middleware');

// Add comprehensive CORS for all routes
const allowedOrigins = [
  'https://web-production-2da3.up.railway.app',
  'https://opensign-frontend.vercel.app',
  process.env.PUBLIC_URL || ''
].filter(Boolean);

// Global CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Parse-Application-Id, X-Parse-Javascript-Key, X-Parse-REST-API-Key, X-Parse-Installation-Id, X-Parse-Session-Token, X-Requested-With, Authorization');
  res.header('Access-Control-Allow-Credentials', 'false');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Initialize MongoDB connection
let mongoClient = null;
let db = null;

async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is required');
      process.exit(1);
    }
    
    // Validate MongoDB URI format
    if (!mongoUri.startsWith('mongodb+srv://') && !mongoUri.startsWith('mongodb://')) {
      console.error('❌ Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
      console.error('❌ Current URI:', mongoUri);
      process.exit(1);
    }
    
    console.log('🔧 Connecting to MongoDB...');
    console.log('🔧 MongoDB URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    console.log('🔧 MongoDB URI format:', mongoUri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : 'mongodb://');
    
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db();
    
    console.log('✅ MongoDB connected successfully');
    console.log('🔧 Database name:', db.databaseName);
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ MongoDB ping successful');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️ Continuing without MongoDB...');
  }
}

// Initialize Parse Server
let parseServer = null;

async function initializeParseServer() {
  try {
    console.log('🔧 Initializing Parse Server...');
    console.log('🔧 Current working directory:', process.cwd());
    console.log('🔧 Node.js version:', process.version);
    
    // Test if we can even require the modules
    console.log('🔧 Testing module loading...');
    
    try {
      console.log('🔧 Loading Parse Server module...');
      const ParseServer = require('parse-server').ParseServer;
      console.log('✅ ParseServer module loaded');
    } catch (moduleError) {
      console.error('❌ Failed to load ParseServer module:', moduleError.message);
      throw moduleError;
    }
    
    console.log('✅ Parse Server module checks passed');
    
    // Parse Server configuration
    console.log('🔧 Creating Parse Server configuration...');
    const parseConfig = require('./parse-config');
    
    console.log('🔧 Parse Server config:', JSON.stringify(parseConfig, null, 2));
    
    console.log('🔧 Creating Parse Server instance...');
    parseServer = new ParseServer(parseConfig);
    
    console.log('✅ Parse Server configured');
    console.log('🔧 Parse Server object type:', typeof parseServer);
    console.log('🔧 Parse Server object keys:', Object.keys(parseServer));
    
    // Mount Parse Server using the same logic that works in test-mount
    console.log('🔧 Attempting to mount Parse Server...');
    console.log('🔧 Parse Server app property:', typeof parseServer.app);
    console.log('🔧 Parse Server app keys:', parseServer.app ? Object.keys(parseServer.app) : 'no app property');
    
    // Use the same mounting approach that works in test-mount
    const parseMount = (require('./parse-config').mountPath) || '/parse';
    console.log('🔧 Mounting Parse Server at', parseMount, '...');
    
    // Mount Parse Server (CORS is already handled globally)
    app.use(parseMount, parseServer);
    console.log('✅ Parse Server mounted at', parseMount);
    
  } catch (error) {
    console.error('❌ Error initializing Parse Server:', error.message);
    console.error('❌ Stack trace:', error.stack);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.log('⚠️ Continuing without Parse Server...');
  }
}

// Create a simple HTTP server with Express
const port = process.env.PORT || 8080;
console.log('🔧 Using port:', port);
console.log('🔧 All environment variables:', Object.keys(process.env));
console.log('🔧 PORT from env:', process.env.PORT);
console.log('🔧 RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
console.log('🔧 RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);

console.log('✅ Routes defined');

// Start the server
app.listen(port, '0.0.0.0', async function () {
  console.log('✅ Express OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('🌐 Server bound to all interfaces (0.0.0.0)');
  console.log('🔧 Environment: PORT=' + process.env.PORT + ', NODE_ENV=' + process.env.NODE_ENV);
  
  // Connect to MongoDB after server starts
  await connectToMongoDB();
  
  // Add routes first (before Parse Server initialization)
  app.get('/', (req, res) => {
    console.log('📋 Root endpoint accessed');
  res.status(200).send('opensign-server is running !!!');
});

  app.get('/health', (req, res) => {
    console.log('🏥 Health check endpoint accessed');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'opensign-server',
      message: 'Express server is running',
      mongodb: db ? 'connected' : 'disconnected',
      parseServer: parseServer ? 'initialized' : 'not initialized'
    });
  });

  app.get('/ping', (req, res) => {
    console.log('🏓 Ping endpoint accessed');
    res.status(200).send('pong');
  });

  // Debug endpoint to test Parse Server loading
  app.get('/debug', (req, res) => {
    console.log('🔍 Debug endpoint accessed');
    
    let debugInfo = {
      nodeVersion: process.version,
      workingDirectory: process.cwd(),
      parseServerStatus: 'not tested',
      parseServerInstance: 'not tested',
      parseServerMount: 'not tested'
    };
    
    try {
      console.log('🔍 Testing Parse Server module loading...');
      const ParseServer = require('parse-server').ParseServer;
      debugInfo.parseServerStatus = 'module loaded successfully';
      console.log('✅ Parse Server module loaded in debug endpoint');
      
      // Test creating a Parse Server instance with the same config as main server
      console.log('🔍 Testing Parse Server instance creation...');
      const parseConfig = require('./parse-config');
      
      const testParseServer = new ParseServer(parseConfig);
      debugInfo.parseServerInstance = 'instance created successfully';
      console.log('✅ Parse Server instance created in debug endpoint');
      
      // Test mounting
      console.log('🔍 Testing Parse Server mounting...');
      console.log('🔧 Parse Server app property:', typeof testParseServer.app);
      console.log('🔧 Parse Server app keys:', testParseServer.app ? Object.keys(testParseServer.app) : 'no app property');
      
      if (testParseServer.app) {
        debugInfo.parseServerMount = 'parseServer.app exists and ready for mounting';
      } else {
        debugInfo.parseServerMount = 'parseServer.app does not exist, would use direct mounting';
      }
      console.log('✅ Parse Server mounting test completed');
      
    } catch (error) {
      if (error.message.includes('module')) {
        debugInfo.parseServerStatus = `failed: ${error.message}`;
      } else if (error.message.includes('mount')) {
        debugInfo.parseServerMount = `failed: ${error.message}`;
      } else {
        debugInfo.parseServerInstance = `failed: ${error.message}`;
      }
      console.error('❌ Parse Server test failed:', error.message);
    }
    
    res.status(200).json(debugInfo);
  });

  // Test endpoint to try mounting Parse Server on-demand
  app.get('/test-mount', async (req, res) => {
    console.log('🔧 Test mount endpoint accessed');
    
    try {
      console.log('🔧 Testing Parse Server mounting on-demand...');
      const ParseServer = require('parse-server').ParseServer;
      
      const parseConfig = require('./parse-config');
      
      const testParseServer = new ParseServer(parseConfig);
      console.log('✅ Parse Server instance created');
      
      // Try mounting
      console.log('🔧 Attempting to mount Parse Server...');
      app.use('/test-parse', testParseServer);
      console.log('✅ Parse Server mounted at /test-parse');
      
      res.status(200).json({
        success: true,
        message: 'Parse Server mounted successfully at /test-parse',
        mountPath: '/test-parse'
      });
      
    } catch (error) {
      console.error('❌ Test mount failed:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error code:', error.code);
      
      res.status(500).json({
        success: false,
        error: error.message,
        errorName: error.name,
        errorCode: error.code,
        stack: error.stack
      });
    }
  });
  
     console.log('✅ Custom routes added');
   
       // Initialize Parse Server after server is fully started and routes are defined
    console.log('🔧 Initializing Parse Server after server startup...');
    
    // Add a small delay to ensure server is fully ready
    setTimeout(async () => {
      try {
        console.log('🔧 Testing Parse Server mounting on-demand...');
        const ParseServer = require('parse-server').ParseServer;
        
        const parseConfig = require('./parse-config');
        
        const testParseServer = new ParseServer(parseConfig);
        console.log('✅ Parse Server instance created');
        
        // Try mounting
        console.log('🔧 Attempting to mount Parse Server...');
        app.use(parseConfig.mountPath || '/parse', testParseServer);
        console.log('✅ Parse Server mounted at', parseConfig.mountPath || '/parse');
        
        // Update the global parseServer variable
        parseServer = testParseServer;
        console.log('✅ Parse Server initialization completed');
        
      } catch (error) {
        console.error('❌ Parse Server initialization failed:', error.message);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error code:', error.code);
        console.log('⚠️ Continuing without Parse Server...');
      }
    }, 1000); // 1 second delay
 });

console.log('✅ Server startup initiated');

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

console.log('✅ Signal handlers registered');
