import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Button
} from '@mui/material';
import api from '../services/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography>
            Your order number is <strong>{order._id}</strong>
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        {order.items.map(item => (
          <Grid container key={item.product._id} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography>
                {item.quantity} x {item.product.name}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Typography>
                ${(item.quantity * item.price).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" textAlign="right">
          Total: ${order.totalPrice.toFixed(2)}
        </Typography>

        <Box textAlign="center" mt={4}>
          <Button variant="contained" component={RouterLink} to="/products">
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
