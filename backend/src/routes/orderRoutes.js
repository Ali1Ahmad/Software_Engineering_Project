// backend/src/routes/orderRoutes.js
import { markOrderAsDelivered } from '../controllers/orderController.js'; // 👈 import it first!
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  placeOrder,
  getOrderById,
  getMyOrders,
  cancelOrder // ✅ Add this
} from '../controllers/orderController.js';

const router = express.Router();

// All routes below require authentication
router.use(protect);

// ✅ Fetch all orders of the logged-in user
router.get('/', getMyOrders);

// ✅ Place a new order
router.post('/', placeOrder);

// ✅ Fetch single order by ID
router.get('/:id', getOrderById);

// ✅ Cancel an order (NEW)
router.put('/cancel/:id', cancelOrder);

// Inside your router
router.put('/:id/deliver', protect, markOrderAsDelivered);

export default router;


