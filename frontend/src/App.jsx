import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';

import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import SellerDashboard from './components/SellerDashboard';

import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import MyOrders from './components/MyOrders';
import OrderDetail from './components/OrderDetail';
import AdminDashboard from './components/AdminDashboard';

function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* default → Welcome landing page */}
            <Route path="/" element={<Welcome />} />

            {/* Public: auth + product browsing */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Protected Customer */}
            <Route
              path="/profile"
              element={<PrivateRoute><Profile /></PrivateRoute>}
            />
            <Route
              path="/cart"
              element={<PrivateRoute><Cart /></PrivateRoute>}
            />
            <Route
              path="/checkout"
              element={<PrivateRoute><Checkout /></PrivateRoute>}
            />
            <Route
              path="/order-confirmation/:id"
              element={<PrivateRoute><OrderConfirmation /></PrivateRoute>}
            />
            <Route
              path="/myorders"
              element={<PrivateRoute><MyOrders /></PrivateRoute>}
            />

            <Route
              path="/myorders/:id"
              element={<PrivateRoute><OrderDetail /></PrivateRoute>}
            />


            {/* Protected Seller */}
            <Route
              path="/seller"
              element={<PrivateRoute><SellerDashboard /></PrivateRoute>}
            />
            {/* future: Admin dashboard */}
            <Route
              path="/admin"
              element={<PrivateRoute><AdminDashboard /></PrivateRoute>}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
