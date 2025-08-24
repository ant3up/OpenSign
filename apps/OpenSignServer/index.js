console.log('🚀 Starting Express server...');

const express = require('express');
const cors = require('cors');

console.log('✅ Express and CORS modules loaded');

// Create Express app
const app = express();

// Add middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log('✅ Express app created with middleware');

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
    message: 'Express server is running'
  });
});

app.get('/ping', (req, res) => {
  console.log('🏓 Ping endpoint accessed');
  res.status(200).send('pong');
});

console.log('✅ Routes defined');

// Start the server
app.listen(port, '0.0.0.0', function () {
  console.log('✅ Express OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('🌐 Server bound to all interfaces (0.0.0.0)');
  console.log('🔧 Environment: PORT=' + process.env.PORT + ', NODE_ENV=' + process.env.NODE_ENV);
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
