# 🚀 Deploy to Render (Free)

## Prerequisites
- GitHub account
- Your code pushed to GitHub (✅ already done)
- Render account (free - no credit card required)

## Step-by-Step Deployment Guide

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account (recommended)

### Step 2: Deploy Your Application

#### Option A: Using render.yaml (Automatic - Recommended)

1. **Connect Repository**
   - In Render dashboard, click **"New +"** → **"Blueprint"**
   - Click **"Connect a repository"**
   - Authorize Render to access your GitHub
   - Select your repository: `Video-Graph-AI`

2. **Configure Blueprint**
   - Render will automatically detect `render.yaml`
   - Click **"Apply"**
   - Wait for deployment (5-10 minutes)

3. **Done!** 🎉
   - You'll get a URL like: `https://videograph-ai.onrender.com`

#### Option B: Manual Setup (Alternative)

1. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select `Video-Graph-AI`

2. **Configure Service**
   - **Name**: `videograph-ai`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Environment**: `Docker`
   - **Plan**: `Free`

3. **Advanced Settings** (Optional)
   - **Health Check Path**: `/`
   - **Auto-Deploy**: `Yes` (deploys on git push)

4. **Create Web Service**
   - Click **"Create Web Service"**
   - Wait for build and deployment

### Step 3: Access Your Application

Once deployed, you'll receive a URL like:
```
https://videograph-ai.onrender.com
```

**Important Notes:**
- Frontend will be accessible at the root URL
- Backend API will be at the same URL (port mapping handled automatically)
- First load may take 30 seconds (free tier spins down after inactivity)

## ⚙️ Configuration Details

### Ports
- Render automatically maps your internal ports to HTTPS
- Your app runs on ports 5001 (backend) and 5173 (frontend) internally
- Externally accessible via single HTTPS URL

### Environment Variables
Already configured in `render.yaml`:
- `NODE_ENV=production`
- `PORT=5001`

### Free Tier Limitations
- ✅ 750 hours/month (24/7 uptime)
- ✅ Custom domain support
- ✅ Automatic SSL
- ⚠️ Spins down after 15 min of inactivity
- ⚠️ Takes ~30s to wake up on first request

## 🔄 Auto-Deploy on Git Push

Once connected, Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update application"
git push origin main
```

Render will detect the push and redeploy automatically!

## 📊 Monitoring

In Render dashboard you can:
- View deployment logs
- Monitor service health
- See traffic metrics
- Configure custom domains
- Set up environment variables

## 🐛 Troubleshooting

### Build Fails?
- Check logs in Render dashboard
- Ensure Dockerfile is in root directory
- Verify all dependencies are in package.json

### Can't Access Application?
- Wait 30 seconds for cold start
- Check service status in dashboard
- Verify health check is passing

### Need to Update?
```bash
git push origin main
```
Render auto-deploys!

## 🎯 Next Steps

After deployment:
1. Test your application at the Render URL
2. (Optional) Add custom domain in Render settings
3. (Optional) Set up monitoring/alerts
4. Share your live app! 🎉

## 💡 Pro Tips

- **Custom Domain**: Free SSL with custom domains
- **Logs**: Real-time logs in dashboard
- **Rollback**: Easy rollback to previous deployments
- **Secrets**: Add API keys as environment variables (if needed)

## Cost
**100% FREE** for this application! 🎉

No credit card required for free tier.
