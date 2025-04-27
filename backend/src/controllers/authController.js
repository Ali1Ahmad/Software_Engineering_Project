import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'Email already in use' });
  }
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email,
    password: hash,
    role,
    isApproved: role === 'seller' ? false : true // ✅ Important!
  });

  res.status(201).json({
    token: genToken(user._id),
    user: { _id: user._id, name, email, role: user.role }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({
    token: genToken(user._id),
    user: { _id: user._id, name: user.name, email, role: user.role }
  });
};
