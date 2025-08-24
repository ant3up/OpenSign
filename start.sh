#!/bin/bash

echo "=== OpenSign Railway Deployment ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "APP_ID: $APP_ID"
echo "MASTER_KEY: $MASTER_KEY"
echo "PARSE_MOUNT: $PARSE_MOUNT"
echo "USE_LOCAL: $USE_LOCAL"
echo "SERVER_URL: $SERVER_URL"
echo "DATABASE_URI: $DATABASE_URI"

echo "=== Installing OpenSign Server Dependencies ==="
cd apps/OpenSignServer
npm install

echo "=== Starting OpenSign Server ==="
npm start
