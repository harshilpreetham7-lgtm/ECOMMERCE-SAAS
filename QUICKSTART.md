# 🎯 Quick Start Guide

Get your E-Commerce SaaS platform running locally in 5 minutes!

## Prerequisites

- Node.js v18+
- npm or yarn
- Git
- MongoDB (local or Atlas)

## Option 1: Using npm (Recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/harshilpreetham7-ltgm/ecommerce-saas.git
cd ecommerce-saas
```

### 2. Run Setup Script

**For macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```bash
setup.bat
```

### 3. Configure Environment

**Backend:**
```bash
cd backend
nano .env  # or edit in your editor
```

Update these key variables:
```
MONGODB_URI=mongodb+srv://your:password@cluster.mongodb.net/ecommerce_saas
JWT_SECRET=your_random_secret_key
STRIPE_SECRET_KEY=sk_test_your_key
```

**Frontend:**
```bash
cd ../frontend
nano .env
```

Update:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 4. Start Development Servers

```bash
# From root directory
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Option 2: Using Docker

### 1. Start Services

```bash
docker-compose up
```

This starts:
- MongoDB: localhost:27017
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### 2. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/v1
- MongoDB: localhost:27017

## First Time Setup

### 1. Create Super Admin Account

```bash
# Register with email/password
# Select role: "SuperAdmin" during registration
```

### 2. Create Vendor Account

```bash
# Create another account
# Select role: "Vendor"
```

### 3. Create Store (Vendor)

```bash
# Login as vendor
# Go to dashboard
# Click "Create Store"
# Fill store details
```

### 4. Add Products

```bash
# As vendor, go to dashboard
# Click "Add Product"
# Upload images
# Set price and inventory
```

### 5. Purchase Products (Customer)

```bash
# Login as customer/guest
# Browse products
# Add to cart
# Checkout
```

## Test Credentials

You can use these for testing (after creating):

**Vendor Account:**
- Email: vendor@test.com
- Password: password123
- Role: Vendor

**Customer Account:**
- Email: customer@test.com
- Password: password123
- Role: Customer

**Admin Account:**
- Email: admin@test.com
- Password: password123
- Role: SuperAdmin

## Key Features to Explore

### Customer Features
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout with Stripe
- [ ] View orders
- [ ] User profile

### Vendor Features
- [ ] Create store
- [ ] Add products with images
- [ ] View orders
- [ ] Track revenue
- [ ] Manage inventory

### Admin Features
- [ ] View all orders
- [ ] View all users
- [ ] Platform analytics
- [ ] Revenue tracking

## Useful Commands

### Backend
```bash
cd backend

# Development
npm run dev

# Production
npm start

# Tests
npm test
```

### Frontend
```bash
cd frontend

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce_saas
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Project Structure

```
ecommerce-saas/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── store/
│   │   └── services/
│   └── package.json
└── docker-compose.yml
```

## Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use"
```bash
# Kill process on port
# macOS/Linux:
lsof -ti :5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB connection error
- Ensure MongoDB is running
- Check connection string
- Verify credentials

### CORS error
- Check FRONTEND_URL in backend .env
- Verify API_BASE_URL in frontend .env

## Next Steps

1. ✅ Run locally
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
3. Read [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
4. Customize for your needs
5. Deploy to production

## Need Help?

- Check [backend README](./backend/README.md)
- Check [frontend README](./frontend/README.md)
- Open an issue on GitHub
- Review API documentation

---

**Happy building! 🚀**
