import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get all orders containing this seller's products
// @route   GET /api/seller/orders
// @access  Seller/Admin
export const getSellerOrders = asyncHandler(async (req, res) => {
  // 1) Find all product IDs owned by this seller
  const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
  const prodIds = sellerProducts.map(p => p._id);

  // 2) Find orders where any item’s product is in prodIds
  const orders = await Order.find({ 'items.product': { $in: prodIds } })
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name price')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Update order status (e.g. mark as Shipped)
// @route   PUT /api/seller/orders/:id
// @access  Seller/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure this seller owns at least one item in the order (or is admin)
  const sellerProducts = await Product.find({ seller: req.user._id }).select('_id');
  const prodIds = sellerProducts.map(p => p._id.toString());
  const hasProduct = order.items.some(item =>
    prodIds.includes(item.product.toString())
  );
  if (!hasProduct && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this order');
  }

  // Update status
  order.status = req.body.status || order.status;
  const updated = await order.save();
  res.json(updated);
});
