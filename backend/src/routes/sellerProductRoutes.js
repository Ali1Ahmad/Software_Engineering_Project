import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  getSellerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/sellerProductController.js';

const router = express.Router();

// All routes require a logged-in seller or admin
router.use(protect, authorize('seller', 'admin'));

router.route('/')
  .get(getSellerProducts)
  .post(createProduct);

router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
