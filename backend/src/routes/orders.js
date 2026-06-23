import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getOrderStats,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/stats', protect, getOrderStats);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
