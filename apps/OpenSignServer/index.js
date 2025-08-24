console.log('🚀 Starting Express server...');

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

console.log('✅ Express, CORS, and MongoDB modules loaded');

// Create Express app
const app = express();

// Add middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log('✅ Express app created with middleware');

// Initialize MongoDB connection
let mongoClient = null;
let db = null;

async function connectToMongoDB() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URI || 'mongodb://localhost:27017/opensign';
    console.log('🔧 Connecting to MongoDB...');
    console.log('🔧 MongoDB URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
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

// Create a simple HTTP server with Express
const port = process.env.PORT || 8080;
console.log('🔧 Using port:', port);
console.log('🔧 All environment variables:', Object.keys(process.env));
console.log('🔧 PORT from env:', process.env.PORT);
console.log('🔧 RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
console.log('🔧 RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);

// Route handling
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
    mongodb: db ? 'connected' : 'disconnected'
  });
});

app.get('/ping', (req, res) => {
  console.log('🏓 Ping endpoint accessed');
  res.status(200).send('pong');
});

console.log('✅ Routes defined');

// Start the server
app.listen(port, '0.0.0.0', async function () {
  console.log('✅ Express OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('🌐 Server bound to all interfaces (0.0.0.0)');
  console.log('🔧 Environment: PORT=' + process.env.PORT + ', NODE_ENV=' + process.env.NODE_ENV);
  
  // Connect to MongoDB after server starts
  await connectToMongoDB();
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
