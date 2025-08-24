const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).send('Test server is running!');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'test-server'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Test server running on port ${port}`);
});
