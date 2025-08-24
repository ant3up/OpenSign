import express from 'express';
import cors from 'cors';
import http from 'http';

// Create the most basic Express app possible
const app = express();

// Add basic middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic health check endpoints - respond immediately
app.get('/', function (req, res) {
  res.status(200).send('opensign-server is running !!!');
});

app.get('/health', function (req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'opensign-server',
    message: 'Basic server is running'
  });
});

// Start the server immediately
const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);

httpServer.listen(port, '0.0.0.0', function () {
  console.log('✅ Basic OpenSign server running on port ' + port + '.');
  console.log('🚀 Server is ready to accept requests!');
  console.log('📍 Health check available at: http://localhost:' + port + '/health');
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
