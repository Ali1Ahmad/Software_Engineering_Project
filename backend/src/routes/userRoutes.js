import { Router } from 'express';
import { getMe, updateMe, getShippingAddress, saveShippingAddress } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

// New Routes
router.get('/shipping-address', protect, getShippingAddress);
router.put('/shipping-address', protect, saveShippingAddress);

export default router;
