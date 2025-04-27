import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update current user's profile
// @route   PUT /api/users/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, phone, address } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  const updatedUser = await user.save();
  res.json(updatedUser);
});

// @desc    Get current user's shipping address
// @route   GET /api/users/shipping-address
// @access  Private
const getShippingAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user.shippingAddress || {});
});

// @desc    Save/update shipping address
// @route   PUT /api/users/shipping-address
// @access  Private
const saveShippingAddress = asyncHandler(async (req, res) => {
  const { address, city, postalCode, country } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.shippingAddress = {
    address,
    city,
    postalCode,
    country
  };

  await user.save();

  res.json({
    message: 'Shipping address saved successfully',
    shippingAddress: user.shippingAddress
  });
});

export { getMe, updateMe, getShippingAddress, saveShippingAddress };
