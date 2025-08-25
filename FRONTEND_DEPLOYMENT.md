# OpenSign Frontend Deployment Guide

## 🎯 Overview
This guide will help you deploy the OpenSign React frontend to various cloud platforms. The frontend connects to the Parse Server backend that we've already deployed.

## 📋 Prerequisites
- ✅ Backend deployed and working (Parse Server)
- ✅ Git repository with frontend code
- ✅ Node.js 18+ installed locally (for testing)

## 🚀 Deployment Options

### Option 1: Railway (Recommended)
Railway is a great platform for full-stack applications.

#### Steps:
1. **Fork the repository** to your GitHub account
2. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your forked repository
   - Choose "Deploy Now"

3. **Configure Environment Variables** in Railway:
   ```
   NODE_ENV=production
   PORT=3000
   REACT_APP_APPID=opensign
   REACT_APP_SERVERURL=https://opensign-production-ee42.up.railway.app/parse
   ```

4. **Set Build Command**:
   ```
   cd apps/OpenSign && npm install && npm run build
   ```

5. **Set Start Command**:
   ```
   cd apps/OpenSign && npm start
   ```

### Option 2: Vercel
Vercel is excellent for React applications.

#### Steps:
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd apps/OpenSign
   vercel
   ```

3. **Configure Environment Variables** in Vercel dashboard:
   ```
   REACT_APP_APPID=opensign
   REACT_APP_SERVERURL=https://opensign-production-ee42.up.railway.app/parse
   ```

### Option 3: Netlify
Netlify is another great option for static sites.

#### Steps:
1. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Build command**: `cd apps/OpenSign && npm install && npm run build`
   - **Publish directory**: `apps/OpenSign/build`

3. **Set Environment Variables**:
   ```
   REACT_APP_APPID=opensign
   REACT_APP_SERVERURL=https://opensign-production-ee42.up.railway.app/parse
   ```

### Option 4: Render
Render is a good alternative to Railway.

#### Steps:
1. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Click "New" → "Static Site"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Build Command**: `cd apps/OpenSign && npm install && npm run build`
   - **Publish Directory**: `apps/OpenSign/build`

3. **Set Environment Variables**:
   ```
   REACT_APP_APPID=opensign
   REACT_APP_SERVERURL=https://opensign-production-ee42.up.railway.app/parse
   ```

## 🔧 Environment Variables

### Required Variables:
- `REACT_APP_APPID`: Parse Server App ID (default: "opensign")
- `REACT_APP_SERVERURL`: Backend server URL (your deployed backend)

### Optional Variables:
- `NODE_ENV`: Environment (production/development)
- `PORT`: Port number (default: 3000)

## 🧪 Local Testing

Before deploying, test locally:

```bash
# Navigate to frontend directory
cd apps/OpenSign

# Install dependencies
npm install

# Set environment variables
export REACT_APP_APPID=opensign
export REACT_APP_SERVERURL=https://opensign-production-ee42.up.railway.app/parse

# Start development server
npm start
```

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check Node.js version (requires 18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **Environment Variables Not Working**:
   - Ensure variables start with `REACT_APP_`
   - Restart the application after setting variables

3. **Backend Connection Issues**:
   - Verify backend URL is correct
   - Check if backend is running and accessible
   - Test backend endpoints manually

4. **CORS Issues**:
   - Backend should already be configured for CORS
   - Check browser console for CORS errors

## 📱 Testing the Deployment

After deployment, test these features:

1. **Homepage**: Should load without errors
2. **Login**: Should connect to backend
3. **PDF Upload**: Should work with backend
4. **Signing**: Should process through backend

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Render Documentation](https://render.com/docs)

## 🎉 Success!

Once deployed, your OpenSign application will be fully functional with:
- ✅ Frontend: User interface for document signing
- ✅ Backend: Parse Server API for data management
- ✅ Database: MongoDB for data storage

Your users can now upload PDFs, add signatures, and complete document workflows!
