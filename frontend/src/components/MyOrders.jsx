import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Divider,
  Chip
} from '@mui/material';
import api from '../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(res.data);
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const token = localStorage.getItem('token');
      await api.put(`/orders/cancel/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order cancelled successfully!');
      fetchOrders(); // refresh the orders after cancelling
    } catch (err) {
      console.error('❌ Error cancelling order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {loading ? (
        <Typography>Loading orders...</Typography>
      ) : orders.length === 0 ? (
        <Typography>You have no orders yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map(order => (
            <Grid item xs={12} key={order._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">
                    Order #{order._id.slice(-6)}
                  </Typography>
                  <Typography color="text.secondary">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography color="text.secondary">
                    Total: ${order.totalPrice?.toFixed(2)}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Items:</Typography>
                  {order.items.map((item, index) => (
                    <Typography key={index}>
                      {item.product?.name || 'Unnamed Product'} × {item.quantity ?? 1}
                    </Typography>
                  ))}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Chip
                    label={order.status || 'Processing'}
                    color={
                      order.status === 'Delivered'
                        ? 'success'
                        : order.status === 'Cancelled'
                        ? 'error'
                        : 'warning'
                    }
                  />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/myorders/${order._id}`}
                    >
                      View Details
                    </Button>

                    {/* Cancel Button */}
                    {order.status === 'Processing' && (
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
