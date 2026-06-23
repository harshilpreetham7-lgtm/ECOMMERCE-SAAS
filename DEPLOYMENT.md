# 🚀 Deployment & GitHub Setup Guide

This guide will help you deploy the Multi-Tenant E-Commerce SaaS Platform to production.

## Prerequisites

- GitHub account ([@harshilpreetham7-ltgm](https://github.com/harshilpreetham7-ltgm))
- Git installed locally
- Vercel account (for frontend)
- Render, Railway, or AWS account (for backend)
- MongoDB Atlas account
- Stripe account
- Cloudinary account

## Step 1: Push to GitHub

### Create a New Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `ecommerce-saas`
3. Description: "Multi-Tenant E-Commerce SaaS Platform"
4. Set to **Public** (for open source)
5. Click "Create repository"

### Push Your Local Project

```bash
cd C:/Projects/ecommerce-saas

# Add GitHub remote
git remote add origin https://github.com/harshilpreetham7-ltgm/ecommerce-saas.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Verify Push

Visit your repository: https://github.com/harshilpreetham7-ltgm/ecommerce-saas

## Step 2: Configure Environment Variables

### Backend Environment Setup

1. Create `.env` from `.env.example`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Fill in your credentials:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_saas
   JWT_SECRET=generate_a_strong_random_key
   STRIPE_SECRET_KEY=sk_test_your_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   FRONTEND_URL=http://localhost:3000
   ```

### Frontend Environment Setup

1. Create `.env` from `.env.example`:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Fill in your values:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
   ```

## Step 3: Deploy Backend

### Option A: Deploy to Render

1. **Create Account**: Go to [render.com](https://render.com)

2. **Create Web Service**:
   - New → Web Service
   - Connect GitHub account
   - Select `ecommerce-saas` repository
   - Name: `ecommerce-saas-backend`
   - Environment: Node
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Region: Choose closest to you

3. **Add Environment Variables**:
   - Click on your service
   - Environment
   - Add all variables from `.env`

4. **Deploy**:
   - Click "Create Web Service"
   - Render will auto-deploy

### Option B: Deploy to Railway

1. **Create Account**: Go to [railway.app](https://railway.app)

2. **Create New Project**:
   - Deploy from GitHub
   - Select your repository
   - Select `ecommerce-saas` template

3. **Add Environment Variables**:
   - Variables tab
   - Add all from `.env`

4. **Deploy**:
   - Railway auto-deploys on push

### Option C: Deploy to AWS

1. **Launch EC2 Instance**:
   ```bash
   - Ubuntu 22.04 LTS
   - t2.micro (free tier)
   - Allow SSH, HTTP, HTTPS
   ```

2. **Connect and Setup**:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone https://github.com/harshilpreetham7-ltgm/ecommerce-saas.git
   cd ecommerce-saas/backend
   
   # Install dependencies
   npm install
   
   # Create .env file
   nano .env
   # Paste environment variables
   
   # Start with PM2
   pm2 start "npm start" --name "ecommerce-backend"
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx Reverse Proxy**:
   ```bash
   sudo apt install -y nginx
   
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Step 4: Deploy Frontend

### Option A: Deploy to Vercel (Recommended)

1. **Create Account**: Go to [vercel.com](https://vercel.com)

2. **Import Project**:
   - New Project
   - Import Git Repository
   - Select `ecommerce-saas`
   - Framework: Vite
   - Root Directory: `./frontend`

3. **Configure**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   - Settings → Environment Variables
   - Add `VITE_API_BASE_URL` and `VITE_STRIPE_PUBLIC_KEY`

5. **Deploy**:
   - Click Deploy
   - Vercel auto-deploys on future pushes

### Option B: Deploy to Netlify

1. **Create Account**: Go to [netlify.com](https://netlify.com)

2. **Connect Repository**:
   - New site from Git
   - Select GitHub
   - Choose repository
   - Select branch: main

3. **Configure**:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables**:
   - Site settings → Build & deploy
   - Environment
   - Add variables

5. **Deploy**:
   - Netlify auto-deploys

### Option C: Docker Deployment

```bash
# Build images
docker build -t ecommerce-frontend ./frontend
docker build -t ecommerce-backend ./backend

# Run containers
docker run -d -p 3000:3000 ecommerce-frontend
docker run -d -p 5000:5000 ecommerce-backend
```

## Step 5: Configure MongoDB

### Using MongoDB Atlas (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

2. **Create Account** and verify email

3. **Create Cluster**:
   - Free tier
   - Cloud Provider: AWS/GCP
   - Region: Closest to you
   - Cluster name: `ecommerce-saas`

4. **Create Database User**:
   - Database Access
   - Add Database User
   - Username: `admin`
   - Password: Generate secure password
   - Role: Admin

5. **Whitelist IP**:
   - Network Access
   - Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for development

6. **Get Connection String**:
   - Clusters → Connect
   - Copy connection string
   - Use in `MONGODB_URI`

## Step 6: Setup CI/CD

### GitHub Actions

The workflows are already configured in `.github/workflows/`:

- `frontend.yml` - Builds frontend, runs linting
- `backend.yml` - Builds backend, runs tests

These automatically run on push to `main` or `develop` branches.

## Step 7: Custom Domain Setup

1. **Purchase Domain**:
   - Namecheap, GoDaddy, etc.

2. **Connect to Vercel** (Frontend):
   - Project → Settings → Domains
   - Add domain
   - Update nameservers or add CNAME

3. **Connect to Render/Railway** (Backend):
   - Add custom domain
   - Update DNS records

## Monitoring & Maintenance

### Monitor Application

- **Frontend**: Vercel Analytics
- **Backend**: Render/Railway dashboard
- **Database**: MongoDB Atlas UI

### Logging

```bash
# View backend logs (Render)
# Through dashboard

# View backend logs (Local PM2)
pm2 logs ecommerce-backend

# View frontend build logs
# Through Vercel dashboard
```

### Database Backups

- Enable automatic backups in MongoDB Atlas
- Schedule regular exports

## Scaling & Performance

1. **Database**: Add indexes to frequently queried fields
2. **Frontend**: Enable CDN caching
3. **Backend**: Implement rate limiting
4. **Images**: Use Cloudinary for optimization

## Security Checklist

- [ ] Add `.env` to `.gitignore`
- [ ] Use environment variables for all secrets
- [ ] Enable CORS properly
- [ ] Use HTTPS everywhere
- [ ] Keep dependencies updated
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use strong JWT secrets
- [ ] Setup backups

## Troubleshooting

### Backend Won't Start

```bash
# Check logs
pm2 logs ecommerce-backend

# Restart
pm2 restart ecommerce-backend

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Build Fails

```bash
# Clear cache
rm -rf node_modules .next dist

# Reinstall
npm install

# Build
npm run build
```

### Database Connection Error

- Check MongoDB URI is correct
- Verify IP whitelist includes your server's IP
- Confirm credentials are correct

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Configure environment variables
3. ✅ Deploy backend
4. ✅ Deploy frontend
5. ✅ Setup custom domain
6. ✅ Configure monitoring
7. ✅ Setup backups

## Support

- Documentation: See README.md
- Issues: GitHub Issues
- Discussions: GitHub Discussions

---

**Congratulations! Your E-Commerce SaaS platform is now live! 🎉**
