import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Paper, Typography,
  Button, Box, TextField
} from '@mui/material';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <Typography>Loading...</Typography>;

  const handleAdd = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Typography variant="h5" color="primary" gutterBottom>${product.price}</Typography>
          <Typography paragraph>{product.description}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              type="number"
              label="Qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ width: 80, mr: 2 }}
            />
            <Button variant="contained" onClick={handleAdd}>Add to Cart</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
