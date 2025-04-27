// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import api from '../services/api';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token;
        const { data: user } = await api.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const { data: shipping } = await api.get('/users/shipping-address', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          address: shipping.address || '',
          city: shipping.city || '',
          postalCode: shipping.postalCode || '',
          country: shipping.country || '',
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;

      // Update basic profile (firstName, lastName, email)
      await api.put('/users/me', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update shipping address
      await api.put('/users/shipping-address', {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Update failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: 'center' }}>
        <Typography>Loading Profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          My Profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            type="email"
          />
          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
            Shipping Address
          </Typography>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Update Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
