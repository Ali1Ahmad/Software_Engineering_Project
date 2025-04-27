
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Grid,
  IconButton, TextField, Box, Button, Divider
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { CartContext } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">Your cart is empty</Typography>
          <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            {cartItems.map((item) => (
              <Box key={item.product._id} sx={{ mb: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={3}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: '100%',
                      maxWidth: '100px',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      margin: 'auto'
                    }}
                  />

                  </Grid>
                  <Grid item xs={4}>
                    <Typography>{item.product.name}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        updateQty(item.product._id, Number(e.target.value))
                      }
                      InputProps={{ inputProps: { min: 1 } }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>${(item.qty * item.product.price).toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => removeFromCart(item.product._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Tax (10%)</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

