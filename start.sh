#!/bin/bash

echo "=== OpenSign Railway Deployment ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Set environment variables with fallbacks (based on DigitalOcean deployment)
export NODE_ENV=${NODE_ENV:-production}
export PORT=${PORT:-8080}
export APP_ID=${APP_ID:-opensign}
export MASTER_KEY=${MASTER_KEY:-opensign_master_key_2024}
export PARSE_MOUNT=${PARSE_MOUNT:-/api/app}
export USE_LOCAL=${USE_LOCAL:-true}
export SERVER_URL=${SERVER_URL:-"https://${RAILWAY_PUBLIC_DOMAIN:-localhost}:${PORT:-8080}/api/app"}
export PUBLIC_URL=${PUBLIC_URL:-"https://${RAILWAY_PUBLIC_DOMAIN:-localhost}:${PORT:-8080}"}

echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "APP_ID: $APP_ID"
echo "MASTER_KEY: $MASTER_KEY"
echo "PARSE_MOUNT: $PARSE_MOUNT"
echo "USE_LOCAL: $USE_LOCAL"
echo "SERVER_URL: $SERVER_URL"
echo "PUBLIC_URL: $PUBLIC_URL"

# Set database URI with fallback (prioritize MongoDB Atlas)
if [ -n "$MONGO_URI" ]; then
  export DATABASE_URI="$MONGO_URI"
  echo "Using MongoDB Atlas MONGO_URI: $DATABASE_URI"
elif [ -n "$DATABASE_URI" ]; then
  echo "Using provided DATABASE_URI: $DATABASE_URI"
elif [ -n "$MONGO_URL" ]; then
  export DATABASE_URI="$MONGO_URL"
  echo "Using Railway MONGO_URL: $DATABASE_URI"
elif [ -n "$MONGODB_URL" ]; then
  export DATABASE_URI="$MONGODB_URL"
  echo "Using Railway MongoDB URL: $DATABASE_URI"
else
  export DATABASE_URI="mongodb://localhost:27017/opensign"
  echo "Using fallback database URI: $DATABASE_URI"
fi

echo "DATABASE_URI: $DATABASE_URI"

echo "=== Installing OpenSign Server Dependencies ==="
cd apps/OpenSignServer
npm install

# Test MongoDB Atlas connection if MONGO_URI is provided
if [ -n "$MONGO_URI" ]; then
  echo "=== Testing MongoDB Atlas Connection ==="
  # Install mongodb client for testing
  npm install mongodb --no-save
  
  # Create a simple test script
  cat > test-mongo.js << 'EOF'
const { MongoClient } = require('mongodb');

async function testConnection() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    console.log('✅ MongoDB Atlas connection successful!');
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

  # Run the test
  node test-mongo.js
  rm test-mongo.js
fi

echo "=== Starting OpenSign Server ==="
npm start &

# Wait a moment for the server to start up
echo "=== Waiting for server to start ==="
sleep 10

# Check if server is responding
echo "=== Checking server health ==="
curl -f http://localhost:${PORT:-8080}/health || echo "Server not ready yet, continuing..."

# Keep the script running
wait
