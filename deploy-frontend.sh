#!/bin/bash

echo "🚀 Deploying OpenSign Frontend..."

# Navigate to frontend directory
cd apps/OpenSign

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Frontend is ready for deployment"
    echo "📁 Build files are in: apps/OpenSign/build/"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Frontend deployment script completed!"
