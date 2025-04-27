import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

export default function PaymentForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod}
            label="Payment Method"
            onChange={handleChange}
          >
            <MenuItem value="card">Credit / Debit Card</MenuItem>
            <MenuItem value="cod">Cash on Delivery</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {formData.paymentMethod === 'card' && (
        <>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required={formData.paymentMethod === 'card'}
              label="Card Number"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              required={formData.paymentMethod === 'card'}
              label="Expiry"
              name="cardExpiry"
              placeholder="MM/YY"
              value={formData.cardExpiry}
              onChange={handleChange}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              required={formData.paymentMethod === 'card'}
              label="CVV"
              name="cardCvv"
              value={formData.cardCvv}
              onChange={handleChange}
              autoComplete="off"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
