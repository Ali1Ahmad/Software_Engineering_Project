// backend/src/controllers/sellerProductController.js
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get logged-in seller’s products
// @route   GET /api/seller/products
// @access  Seller/Admin
export const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

// @desc    Create a new product
// @route   POST /api/seller/products
// @access  Seller/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    seller: req.user._id,
    ...req.body,
  });
  const created = await product.save();
  res.status(201).json(created);
});

// @desc    Update a product (logs update to console for debugging)
// @route   PUT /api/seller/products/:id
// @access  Seller/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  console.log(`Updating product ID: ${req.params.id} by seller: ${req.user._id}`);
  const updated = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    { $set: req.body },
    { new: true }
  );
  if (!updated) {
    res.status(404);
    throw new Error('Product not found or not authorized');
  }
  res.json(updated);
});

// @desc    Delete a product
// @route   DELETE /api/seller/products/:id
// @access  Seller/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  console.log(`Deleting product ID: ${req.params.id} by seller: ${req.user._id}`);
  const deleted = await Product.findOneAndDelete({
    _id: req.params.id,
    seller: req.user._id,
  });
  if (!deleted) {
    res.status(404);
    throw new Error('Product not found or not authorized');
  }
  res.json({ message: 'Product removed' });
});
