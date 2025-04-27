import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAllSellers,
  approveSeller,
  disapproveSeller,
  getAllProducts,
  deleteProduct
} from '../controllers/adminController.js';

import { getAllOrders } from '../controllers/adminController.js';


const router = express.Router();

// Protect all admin routes
router.use(protect, adminOnly);

// Sellers Management
router.get('/sellers', getAllSellers);
router.put('/sellers/:id/approve', approveSeller);
router.put('/sellers/:id/disapprove', disapproveSeller);

// Products Management
router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

// Orders Management (NEW!)
router.get('/orders', getAllOrders); // 👈 ✅ Now /admin/orders will work

export default router;
