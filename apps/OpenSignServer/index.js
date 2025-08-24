import express from 'express';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();
import http from 'http';

// Create the most basic Express app possible
const app = express();

// Add basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add IP address middleware
app.use(function (req, res, next) {
  req.headers['x-real-ip'] = getUserIP(req);
  const publicUrl = 'https://' + req?.get('host');
  req.headers['public_url'] = publicUrl;
  next();
});

function getUserIP(request) {
  let forwardedFor = request.headers['x-forwarded-for'];
  if (forwardedFor) {
    if (forwardedFor.indexOf(',') > -1) {
      return forwardedFor.split(',')[0];
    } else {
      return forwardedFor;
    }
  } else {
    return request.socket.remoteAddress;
  }
}

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Basic health check endpoints - respond immediately
app.get('/', function (req, res) {
  res.status(200).send('opensign-server is running !!!');
});

app.get('/health', function (req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'opensign-server',
    message: 'Server with middleware is running',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      DATABASE_URI: process.env.DATABASE_URI ? 'configured' : 'not configured',
      MASTER_KEY: process.env.MASTER_KEY ? 'configured' : 'not configured',
      APP_ID: process.env.APP_ID,
      SERVER_URL: process.env.SERVER_URL
    }
  });
});

// Start the server immediately
const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);

httpServer.listen(port, '0.0.0.0', function () {
  console.log('✅ OpenSign server with middleware running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('📍 Health check available at: http://localhost:' + port + '/health');
  console.log('🔧 Environment variables:');
  console.log('   NODE_ENV:', process.env.NODE_ENV);
  console.log('   PORT:', process.env.PORT);
  console.log('   DATABASE_URI:', process.env.DATABASE_URI ? 'configured' : 'not configured');
  console.log('   MASTER_KEY:', process.env.MASTER_KEY ? 'configured' : 'not configured');
  console.log('   APP_ID:', process.env.APP_ID);
  console.log('   SERVER_URL:', process.env.SERVER_URL);
});

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

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('❌ Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
