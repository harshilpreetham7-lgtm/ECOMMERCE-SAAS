import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/:itemId', protect, removeFromCart);
router.put('/:itemId', protect, updateCartItem);
router.delete('/', protect, clearCart);

export default router;
