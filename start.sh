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
echo "DATABASE_URI: $DATABASE_URI"

echo "=== Installing OpenSign Server Dependencies ==="
cd apps/OpenSignServer
npm install

echo "=== Starting OpenSign Server ==="
npm start
