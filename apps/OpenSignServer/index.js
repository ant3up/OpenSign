console.log('🚀 Starting ultra-minimal server...');

const express = require('express');
const http = require('http');

console.log('✅ Express and HTTP modules loaded');

// Create the most basic Express app possible
const app = express();

console.log('✅ Express app created');

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

const httpServer = http.createServer(app);

console.log('✅ HTTP server created');

httpServer.listen(port, '0.0.0.0', function () {
  console.log('✅ Ultra-minimal OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('🌐 Server bound to all interfaces (0.0.0.0)');
  console.log('🔧 Environment: PORT=' + process.env.PORT + ', NODE_ENV=' + process.env.NODE_ENV);
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
