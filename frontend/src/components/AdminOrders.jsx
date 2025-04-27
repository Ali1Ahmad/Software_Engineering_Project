import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import api from '../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const { data } = await api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('📦 Fetched orders:', data); // 👈 ADD THIS
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await api.put(`/orders/${orderId}/deliver`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'Delivered' } : order
        )
      );

      alert('✅ Order marked as Delivered!');
    } catch (error) {
      console.error('Failed to mark as delivered', error);
      alert('❌ Failed to mark as delivered');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Manage Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">
                Order #{order._id.slice(-6)}
              </Typography>
              <Typography color="text.secondary">
                Customer: {order.user?.name || 'Unknown'}
              </Typography>
              <Typography color="text.secondary">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography sx={{ mt: 1 }}>
                Total: <strong>${order.totalPrice?.toFixed(2)}</strong>
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Items:
              </Typography>
              {order.items.map((item, idx) => (
                <Box key={idx} sx={{ ml: 1 }}>
                  - {item.product?.name || 'Unnamed'} × {item.quantity ?? 1}
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Chip
                label={order.status || 'Processing'}
                color={order.status === 'Delivered' ? 'success' : 'warning'}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pr: 2, pb: 2 }}>
              {order.status !== 'Delivered' && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleDeliver(order._id)}
                >
                  Mark as Delivered
                </Button>
              )}
            </CardActions>
          </Card>
        ))
      )}
    </Container>
  );
}
