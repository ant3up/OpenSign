console.log('🧪 Test file is working!');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT
});

// Test basic require
try {
  const express = require('express');
  console.log('✅ Express module loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Express:', error.message);
}

console.log('🧪 Test completed!');
