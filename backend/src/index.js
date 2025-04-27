import dotenv from 'dotenv';
dotenv.config();            // ← load env vars

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';

import sellerProductRoutes from './routes/sellerProductRoutes.js';
import sellerOrderRoutes from './routes/sellerOrderRoutes.js';
import orderRoutes from './routes/orderRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js';


connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Public & auth
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Customer orders
app.use('/api/orders', orderRoutes);

// Seller-only product & order management
app.use('/api/seller/products', sellerProductRoutes);
app.use('/api/seller/orders', sellerOrderRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/admin', adminRoutes);


app.get('/', (_req, res) => res.send('API up'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
