// frontend/src/components/OrderSummary.jsx
import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';

export default function OrderSummary({ cartItems, formData }) {
  const itemsTotal = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const total = itemsTotal + formData.shippingCost;

  return (
    <Box>
      <Typography variant="h6">Order Summary</Typography>
      <List disablePadding>
        {cartItems.map(i => (
          <ListItem key={i.product._id} sx={{ py:1, px:0 }}>
            <ListItemText primary={`${i.product.name} x${i.qty}`} />
            <Typography variant="body2">
              ${(i.qty * i.product.price).toFixed(2)}
            </Typography>
          </ListItem>
        ))}
        <Divider />
        <ListItem sx={{ py:1, px:0 }}>
          <ListItemText primary="Shipping" />
          <Typography variant="body2">
            ${formData.shippingCost.toFixed(2)}
          </Typography>
        </ListItem>
        <Divider />
        <ListItem sx={{ py:1, px:0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight:700 }}>
            ${total.toFixed(2)}
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
}
