import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, qty) => {
    setCartItems((prev) => {
      const exists = prev.find((x) => x.product._id === product._id);
      if (exists) {
        return prev.map((x) =>
          x.product._id === product._id ? { ...x, qty } : x
        );
      } else {
        return [...prev, { product, qty }];
      }
    });
  };

  const removeFromCart = (productId) =>
    setCartItems((prev) => prev.filter((x) => x.product._id !== productId));

  const updateQty = (productId, qty) =>
    setCartItems((prev) =>
      prev.map((x) =>
        x.product._id === productId ? { ...x, qty } : x
      )
    );

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
