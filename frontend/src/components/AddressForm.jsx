// frontend/src/components/AddressForm.jsx

import React from 'react';
import { Grid, TextField } from '@mui/material';

export default function AddressForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="firstName"
          name="firstName"
          label="First Name"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.firstName}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="Last Name"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.lastName}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          required
          id="address1"
          name="address1"
          label="Address line 1"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.address1}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          id="address2"
          name="address2"
          label="Address line 2 (Optional)"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.address2}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="city"
          name="city"
          label="City"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.city}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="state"
          name="state"
          label="State / Province / Region"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.state}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="postalCode"
          name="postalCode"
          label="Zip / Postal code"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="phone"
          name="phone"
          label="Phone Number"
          fullWidth
          autoComplete="off"
          variant="outlined"
          value={formData.phone}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );
}
