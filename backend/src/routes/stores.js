import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  createStore,
  getStores,
  getStore,
  updateStore,
  deleteStore,
  getVendorStore,
} from '../controllers/storeController.js';

const router = express.Router();

router.post('/', protect, authorize('vendor', 'superadmin'), createStore);
router.get('/', getStores);
router.get('/vendor/my-store', protect, authorize('vendor'), getVendorStore);
router.get('/:id', getStore);
router.put('/:id', protect, authorize('vendor', 'superadmin'), updateStore);
router.delete('/:id', protect, authorize('vendor', 'superadmin'), deleteStore);

export default router;
