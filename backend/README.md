# Backend E-Commerce SaaS Setup Guide

## Prerequisites

- Node.js v16+ 
- MongoDB (local or Atlas)
- npm or yarn

## Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your credentials:**
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_saas
   JWT_SECRET=your_super_secret_key
   STRIPE_SECRET_KEY=sk_test_...
   CLOUDINARY_NAME=your_name
   ...
   ```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

**Register**
```
POST /auth/register
Body: { name, email, password, role }
```

**Login**
```
POST /auth/login
Body: { email, password }
```

### Store Endpoints

**Create Store**
```
POST /stores
Headers: { Authorization: Bearer TOKEN }
Body: { name, description, category, ... }
```

**Get All Stores**
```
GET /stores
```

### Product Endpoints

**Create Product**
```
POST /stores/:storeId/products
Headers: { Authorization: Bearer TOKEN }
Body: { name, description, price, stock, ... }
```

**Get Products**
```
GET /stores/:storeId/products?page=1&limit=20
```

### Cart Endpoints

**Get Cart**
```
GET /cart
Headers: { Authorization: Bearer TOKEN }
```

**Add to Cart**
```
POST /cart/add
Headers: { Authorization: Bearer TOKEN }
Body: { productId, quantity, variant }
```

### Order Endpoints

**Create Order**
```
POST /orders
Headers: { Authorization: Bearer TOKEN }
Body: { shippingAddress, paymentMethod }
```

**Get Orders**
```
GET /orders
Headers: { Authorization: Bearer TOKEN }
```

## Database Models

- **User** - Platform users (Customer, Vendor, SuperAdmin)
- **Store** - Vendor stores
- **Product** - Store products
- **Order** - Customer orders
- **Cart** - Shopping carts

## Deployment

### Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables
5. Deploy!

### AWS/EC2

1. Create EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Set up PM2 for process management
6. Configure Nginx as reverse proxy
7. Set up SSL/TLS certificates

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string
- Verify IP whitelist on MongoDB Atlas

**JWT Token Error**
- Clear browser storage
- Login again
- Check JWT_SECRET is set correctly

## Support

For issues, please open an issue on GitHub.
