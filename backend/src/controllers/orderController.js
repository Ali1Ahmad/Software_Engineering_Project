import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

// @desc    Place new order
// @route   POST /api/orders
// @access  Private (customer)
const placeOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = new Order({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    totalPrice,
    status: 'Processing' // ✅ Always start as "Processing"
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (order owner or admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name price image');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json(order);
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders
// @access  Private (customer)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name price image')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// @desc    Cancel order before shipped
// @route   PUT /api/orders/cancel/:id
// @access  Private (customer)
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this order');
  }

  if (order.status !== 'Processing' && order.status !== 'Pending') {
    res.status(400);
    throw new Error('Cannot cancel order that is already shipped or completed');
  }

  order.status = 'Cancelled';
  await order.save();

  res.json({ message: 'Order cancelled successfully', order });
});

// @desc    Mark order as delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private (Admin or Seller)
const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = 'Delivered';
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

// @desc    Get all orders (for Admin)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('items.product', 'name price image');

  res.json(orders);
});

// ✅ Now export ALL controllers
export {
  placeOrder,
  getOrderById,
  getMyOrders,
  cancelOrder,
  markOrderAsDelivered,
  getAllOrders
};
