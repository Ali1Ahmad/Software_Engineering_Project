import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getSellerOrders,
  updateOrderStatus,
} from '../controllers/sellerOrderController.js';

const router = express.Router();

// All routes require a logged-in seller or admin
router.use(protect, authorize('seller', 'admin'));

// GET    /api/seller/orders       → list this seller’s orders
router.get('/', getSellerOrders);

// PUT    /api/seller/orders/:id   → update an order’s status
router.put('/:id', updateOrderStatus);

export default router;
