# Deployment Guide

## Running Locally

### Backend (Flask API)
```bash
# Navigate to backend directory
cd "RAG-AWs-Maker-JBS/src"

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the server
python app.py
```
The backend will run on `http://localhost:5000`

### Frontend (React/Vite)
```bash
# Navigate to frontend directory
cd "jaffer-focus-metrics-portal"

# Install dependencies (if not already installed)
npm install

# Run the development server
npm run dev
```
The frontend will run on `http://localhost:8080`

---

## Deploying to Railway

### Prerequisites
1. Create a Railway account at [railway.app](https://railway.app)
2. Install Railway CLI (optional): `npm i -g @railway/cli`
3. Have your project pushed to GitHub

### Backend Deployment

1. **Create a New Project on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure the Service**
   - Railway will auto-detect it's a Python project
   - Set the **Root Directory** to: `RAG-AWs-Maker-JBS`
   - Railway will use the `Procfile` to start the server

3. **Set Environment Variables**
   In Railway dashboard, add these environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET_KEY=your_secret_key_here
   ```
   
   **Note:** Railway automatically provides `PORT` environment variable, so you don't need to set it manually. The app will use the PORT variable provided by Railway.
   
   **Optional:** If you want to restrict CORS to specific frontend URLs, you can also add:
   ```
   CORS_ORIGINS=https://your-frontend-url.vercel.app,https://your-frontend-url.up.railway.app
   ```
   (Comma-separated list of allowed origins)

4. **Deploy**
   - Railway will automatically build and deploy when you push to your main branch
   - Or click "Deploy" in the Railway dashboard

5. **Get Your Backend URL**
   - After deployment, Railway will provide a URL like: `https://your-app-name.up.railway.app`
   - Copy this URL - you'll need it for the frontend

### Frontend Deployment

#### Option 1: Deploy Frontend to Railway (Recommended)

1. **Add Frontend as a New Service**
   - In your Railway project, click "New Service"
   - Select "GitHub Repo" again (same repo)
   - Set **Root Directory** to: `jaffer-focus-metrics-portal`

2. **Configure Build Settings**
   - Railway will detect it's a Node.js project
   - Build Command: `npm run build`
   - Start Command: `npx serve -s dist -l $PORT` (serves the built dist folder)

3. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.up.railway.app
   ```

4. **Alternative: Use Static Files**
   - After `npm run build`, serve the `dist` folder
   - You can use `npx serve -s dist -l $PORT` as start command
   - Or configure Railway to serve static files

#### Option 2: Deploy Frontend to Vercel/Netlify (Easier for React)

1. **Vercel:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set **Root Directory** to: `jaffer-focus-metrics-portal`
   - Add Environment Variable:
     ```
     VITE_API_BASE_URL=https://your-backend-url.up.railway.app
     ```
   - Deploy!

2. **Netlify:**
   - Similar process to Vercel
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL`

### CORS Settings

The backend CORS is already configured to:
- Allow localhost origins for local development
- Accept additional origins via the `CORS_ORIGINS` environment variable (comma-separated)

**Optional:** If you want to restrict CORS to specific frontend URLs, add the `CORS_ORIGINS` environment variable in Railway:
```
CORS_ORIGINS=https://your-frontend-url.vercel.app,https://your-frontend-url.up.railway.app
```

If `CORS_ORIGINS` is not set, the backend will allow all origins (useful for development).

### Environment Variables Summary

**Backend (Railway):**
- `GEMINI_API_KEY` - Your Google Gemini API key (required)
- `JWT_SECRET_KEY` - Secret key for JWT tokens (required, generate a random string)
- `PORT` - Automatically set by Railway (don't set manually)
- `CORS_ORIGINS` - Optional: Comma-separated list of allowed frontend URLs

**Frontend (Vercel/Netlify/Railway):**
- `VITE_API_BASE_URL` - Your Railway backend URL (required, e.g., `https://your-app.up.railway.app`)

### Testing Deployment

1. Visit your frontend URL
2. Try logging in with:
   - Email: `antech@gmail.com`
   - Password: `antech123`
3. Test the OKR form submission
4. Check that SMART goals are generated

### Troubleshooting

- **Backend not starting:** 
  - Check Railway logs for errors
  - Ensure `Procfile` exists in `RAG-AWs-Maker-JBS/` directory
  - Verify all dependencies are in `requirements.txt` (gunicorn must be included)
  
- **CORS errors:** 
  - Add your frontend URL to `CORS_ORIGINS` environment variable in Railway
  - Or leave it unset to allow all origins (for development)
  
- **API not connecting:** 
  - Verify `VITE_API_BASE_URL` is set correctly in frontend environment variables
  - Check that the backend URL is accessible (try opening it in browser)
  - Ensure the backend is deployed and running (check Railway logs)
  
- **Build failures:** 
  - Check that all dependencies are in `requirements.txt` and `package.json`
  - Verify Python version compatibility (Railway uses Python 3.11+ by default)
  - Check Railway build logs for specific error messages

---

## Quick Commands Reference

### Local Development
```bash
# Terminal 1 - Backend
cd "RAG-AWs-Maker-JBS/src" && python app.py

# Terminal 2 - Frontend  
cd "jaffer-focus-metrics-portal" && npm run dev
```

### Build for Production
```bash
# Backend - no build needed, just deploy
# Frontend
cd "jaffer-focus-metrics-portal"
npm run build
# Output will be in 'dist' folder
```

