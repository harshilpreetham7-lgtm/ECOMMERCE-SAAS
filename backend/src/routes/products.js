import express from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.post('/:storeId/products', protect, authorize('vendor', 'superadmin'), createProduct);
router.get('/:storeId/products', getProducts);
router.get('/:storeId/products/search', searchProducts);
router.get('/products/:id', optionalAuth, getProduct);
router.put('/products/:id', protect, authorize('vendor', 'superadmin'), updateProduct);
router.delete('/products/:id', protect, authorize('vendor', 'superadmin'), deleteProduct);

export default router;
