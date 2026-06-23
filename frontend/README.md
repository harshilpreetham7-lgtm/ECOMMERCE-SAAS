# Frontend E-Commerce SaaS Setup Guide

## Prerequisites

- Node.js v18+
- npm or yarn

## Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your API details:**
   ```
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   ```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm preview
```

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Page components
├── services/        # API service calls
├── store/           # Redux store & slices
├── styles/          # Global styles
├── utils/           # Utility functions
└── main.jsx        # Entry point
```

## Features

### For Customers
- Browse products from multiple vendors
- Add items to cart
- Secure checkout with Stripe
- Order tracking
- User profile management

### For Vendors
- Create and manage stores
- Add and manage products
- View orders and analytics
- Revenue tracking
- Order status management

### For Admin
- Platform-wide analytics
- User management
- Order management
- Revenue insights

## State Management (Redux)

### Auth Slice
- User login/register
- Token management
- Profile updates

### Cart Slice
- Add/remove items
- Update quantities
- Calculate totals

## API Integration

All API calls are made through the `services/index.js` file.

```javascript
import { authService, productService } from './services';

// Login
const response = await authService.login({ email, password });

// Get products
const products = await productService.getProducts(storeId);
```

## Styling

The app uses Tailwind CSS for styling with custom theme colors:

- Primary: #2563eb
- Secondary: #1e40af
- Success: #10b981
- Danger: #ef4444
- Warning: #f59e0b

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Auto-deploys on push to main

### Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Performance Optimization

- Code splitting with React Router
- Lazy loading components
- Image optimization
- Minified builds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

**API Connection Error**
- Check VITE_API_BASE_URL
- Ensure backend is running
- Check CORS settings

**Build Error**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`

**State Not Persisting**
- Check localStorage permissions
- Verify Redux DevTools (if installed)

## Support

For issues, please open an issue on GitHub.
