import React, { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, Grid, Button, Divider
} from '@mui/material';
import api from '../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/myorders').then(res => setOrders(res.data));
  }, []);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>My Orders</Typography>
      {orders.length === 0 && <Typography>You have no orders yet.</Typography>}
      {orders.map((o) => (
        <Paper key={o._id} sx={{ mb: 3, p: 3 }}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography>Order #{o._id}</Typography>
              <Typography color="text.secondary">
                {new Date(o.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" href={`/order/${o._id}`}>
                View Details
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography>Total: ${o.totalPrice.toFixed(2)}</Typography>
          <Typography>Status: {o.status}</Typography>
        </Paper>
      ))}
    </Container>
  );
}
