import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography,
  Button, Box, TextField, CircularProgress, Divider, Link
} from '@mui/material';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      {/* Back to Products Link */}
      <Box sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/products" color="primary" underline="hover">
          &larr; Back to Products
        </Link>
      </Box>

      <Grid container spacing={4}>
        {/* Left side - Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                margin: 'auto',
                display: 'block'
              }}
            />
          </Paper>
        </Grid>

        {/* Right side - Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" color="text.primary" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            {product.brand ?? 'Brand not available'}
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 2 }}>
            Category: {product.category ?? 'N/A'}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {product.countInStock > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="text.primary" paragraph>
            {product.description || 'No description available for this product.'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <TextField
              type="number"
              label="Quantity"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              InputProps={{ inputProps: { min: 1, max: product.countInStock || 10 } }}
              sx={{ width: 100, mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={product.countInStock === 0}
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
