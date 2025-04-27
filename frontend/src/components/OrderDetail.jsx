import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import api from '../services/api';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      console.log('Fetching order...');
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const res = await api.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('📦 Order fetched:', res.data);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h6" color="error">Order not found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 6, color: 'black' }}>
      <Typography variant="h4" gutterBottom>
        Order #{order._id?.slice(-6)}
      </Typography>

      <Grid container spacing={4}>
        {/* Order Summary Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
              <Typography>Status: {order.status || 'Processing'}</Typography>
              <Typography>Payment Method: {order.paymentMethod}</Typography>
              <Typography>Total Paid: ${order.totalPrice?.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Shipping Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shipping Address</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography>{order.shippingAddress?.address || 'N/A'}</Typography>
              <Typography>
                {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
              </Typography>
              <Typography>{order.shippingAddress?.country}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Items */}
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>Items</Typography>
        <Divider sx={{ mb: 2 }} />

        {order.items?.length > 0 ? (
          order.items.map((item, index) => (
            <Card
              key={index}
              sx={{ mb: 2, p: 2, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 1 }}
            >
              <Box display="flex" justifyContent="space-between">
                <Typography>
                  {item.quantity ?? 1} × {item.product?.name || 'Unnamed Product'}
                </Typography>
                <Typography fontWeight="bold">
                  ${(item.quantity * item.price).toFixed(2)}
                </Typography>
              </Box>
            </Card>
          ))
        ) : (
          <Typography>No items found in this order.</Typography>
        )}
      </Box>
    </Container>
  );
}
