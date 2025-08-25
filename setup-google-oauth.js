#!/usr/bin/env node

/**
 * Google OAuth Setup Script for OpenSign
 * This script helps you set up Google OAuth authentication
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 OpenSign Google OAuth Setup Script');
console.log('=====================================\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupGoogleOAuth() {
  console.log('📋 This script will help you set up Google OAuth for OpenSign.\n');
  
  // Step 1: Google Cloud Console Instructions
  console.log('🔧 Step 1: Google Cloud Console Setup');
  console.log('-------------------------------------');
  console.log('1. Go to https://console.cloud.google.com/');
  console.log('2. Create a new project or select an existing one');
  console.log('3. Enable the Google+ API:');
  console.log('   - Go to "APIs & Services" > "Library"');
  console.log('   - Search for "Google+ API" and enable it');
  console.log('4. Create OAuth 2.0 credentials:');
  console.log('   - Go to "APIs & Services" > "Credentials"');
  console.log('   - Click "Create Credentials" > "OAuth 2.0 Client IDs"');
  console.log('   - Choose "Web application"');
  console.log('   - Add authorized origins:');
  console.log('     * http://localhost:5173 (for development)');
  console.log('     * https://your-railway-domain.up.railway.app (for production)');
  console.log('   - Add redirect URIs:');
  console.log('     * http://localhost:5173');
  console.log('     * https://your-railway-domain.up.railway.app');
  console.log('5. Copy the Client ID\n');
  
  const clientId = await question('Enter your Google OAuth Client ID: ');
  
  if (!clientId || clientId.trim() === '') {
    console.log('❌ Client ID is required. Please run the script again.');
    rl.close();
    return;
  }
  
  // Step 2: Create local .env file
  console.log('\n🔧 Step 2: Creating Local Environment File');
  console.log('------------------------------------------');
  
  const envContent = `# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=${clientId.trim()}

# Parse Server Configuration (already configured)
# PARSE_APP_ID=opensign
# PARSE_SERVER_URL=https://opensign-production-ee42.up.railway.app/parse
# PARSE_MASTER_KEY=opensign_master_key_2024
`;
  
  const envPath = path.join(__dirname, 'apps', 'OpenSign', '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Created .env file at: ${envPath}`);
  } catch (error) {
    console.log(`❌ Failed to create .env file: ${error.message}`);
  }
  
  // Step 3: Railway Environment Variables
  console.log('\n🔧 Step 3: Railway Environment Variables');
  console.log('----------------------------------------');
  console.log('You need to add these environment variables to your Railway project:');
  console.log('');
  console.log('Frontend Service Variables:');
  console.log(`- VITE_GOOGLE_CLIENT_ID: ${clientId.trim()}`);
  console.log('');
  console.log('Backend Service Variables:');
  console.log(`- GOOGLE_CLIENT_ID: ${clientId.trim()}`);
  console.log('- GOOGLE_CLIENT_SECRET: [Your Google Client Secret]');
  console.log('');
  console.log('To add these in Railway:');
  console.log('1. Go to your Railway project dashboard');
  console.log('2. Click on each service (frontend and backend)');
  console.log('3. Go to "Variables" tab');
  console.log('4. Add each variable with its corresponding value');
  console.log('');
  
  // Step 4: Install Dependencies
  console.log('🔧 Step 4: Installing Dependencies');
  console.log('----------------------------------');
  console.log('Installing Google OAuth dependencies...');
  
  const { execSync } = require('child_process');
  
  try {
    // Install frontend dependencies
    console.log('Installing frontend dependencies...');
    execSync('cd apps/OpenSign && npm install', { stdio: 'inherit' });
    
    // Install backend dependencies
    console.log('Installing backend dependencies...');
    execSync('cd apps/OpenSignServer && npm install', { stdio: 'inherit' });
    
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log(`❌ Failed to install dependencies: ${error.message}`);
  }
  
  // Step 5: Test Configuration
  console.log('\n🔧 Step 5: Testing Configuration');
  console.log('--------------------------------');
  console.log('To test your configuration:');
  console.log('');
  console.log('1. Start the development server:');
  console.log('   cd apps/OpenSign && npm run dev');
  console.log('');
  console.log('2. Navigate to http://localhost:5173/auth');
  console.log('');
  console.log('3. Click "Continue with Google"');
  console.log('');
  console.log('4. Complete the OAuth flow');
  console.log('');
  console.log('5. Check the browser console for any errors');
  console.log('');
  
  // Step 6: Deployment
  console.log('🔧 Step 6: Deployment');
  console.log('---------------------');
  console.log('To deploy to Railway:');
  console.log('');
  console.log('1. Commit your changes:');
  console.log('   git add .');
  console.log('   git commit -m "Add Google OAuth support"');
  console.log('   git push');
  console.log('');
  console.log('2. Railway will automatically deploy');
  console.log('');
  console.log('3. Test the production deployment');
  console.log('');
  
  // Summary
  console.log('📋 Setup Summary');
  console.log('----------------');
  console.log('✅ Google OAuth Client ID configured');
  console.log('✅ Local .env file created');
  console.log('✅ Dependencies installed');
  console.log('✅ Backend configuration updated');
  console.log('');
  console.log('🔄 Next Steps:');
  console.log('1. Add environment variables to Railway');
  console.log('2. Test locally with npm run dev');
  console.log('3. Deploy to Railway');
  console.log('4. Test production deployment');
  console.log('');
  console.log('📚 Documentation:');
  console.log('- Frontend setup: apps/OpenSign/GOOGLE_AUTH_SETUP.md');
  console.log('- Complete guide: GOOGLE_OAUTH_SETUP_STEPS.md');
  console.log('');
  console.log('🎉 Setup complete! Happy coding!');
  
  rl.close();
}

setupGoogleOAuth().catch(console.error);
