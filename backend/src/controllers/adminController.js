import User from '../models/userModel.js';
import Product from '../models/Product.js'; // Assuming you have Product model
import Order from '../models/Order.js';
import asyncHandler from 'express-async-handler';


// SELLERS

// Get all sellers
export const getAllSellers = async (req, res) => {
  const sellers = await User.find({ role: 'seller' });
  res.json(sellers);
};

// Approve seller
export const approveSeller = async (req, res) => {
  const seller = await User.findById(req.params.id);

  if (!seller || seller.role !== 'seller') {
    res.status(404);
    throw new Error('Seller not found');
  }

  seller.isApproved = true;
  await seller.save();
  res.json({ message: 'Seller approved successfully' });
};

// Disapprove seller
export const disapproveSeller = async (req, res) => {
  const seller = await User.findById(req.params.id);

  if (!seller || seller.role !== 'seller') {
    res.status(404);
    throw new Error('Seller not found');
  }

  seller.isApproved = false;
  await seller.save();
  res.json({ message: 'Seller disapproved successfully' });
};

// PRODUCTS

// Get all products
export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// Delete product
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
};



export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ status: 'Shipped' })  // <-- filter by status
    .populate('user', 'name email')
    .populate('items.product', 'name price image');
    
  res.json(orders);
});

