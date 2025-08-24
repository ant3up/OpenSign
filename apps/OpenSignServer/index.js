console.log('🚀 Starting ultra-minimal server with only Node.js built-ins...');

const http = require('http');
const url = require('url');

console.log('✅ Node.js built-in modules loaded');

// Create a simple HTTP server with built-in Node.js modules
const port = process.env.PORT || 8080;
console.log('🔧 Using port:', port);
console.log('🔧 All environment variables:', Object.keys(process.env));
console.log('🔧 PORT from env:', process.env.PORT);
console.log('🔧 RAILWAY_STATIC_URL:', process.env.RAILWAY_STATIC_URL);
console.log('🔧 RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`📋 Request: ${req.method} ${path}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route handling
  if (path === '/' || path === '') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('opensign-server is running !!!');
  } else if (path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'opensign-server',
      message: 'Ultra-minimal server with Node.js built-ins'
    }));
  } else if (path === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

console.log('✅ HTTP server created');

server.listen(port, '0.0.0.0', function () {
  console.log('✅ Ultra-minimal OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('🌐 Server bound to all interfaces (0.0.0.0)');
  console.log('🔧 Environment: PORT=' + process.env.PORT + ', NODE_ENV=' + process.env.NODE_ENV);
  
  // Test if server is actually listening
  const address = server.address();
  console.log('🔧 Server address:', address);
  console.log('🔧 Server port:', address.port);
  console.log('🔧 Server family:', address.family);
});

console.log('✅ Server startup initiated');

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

console.log('✅ Signal handlers registered');
