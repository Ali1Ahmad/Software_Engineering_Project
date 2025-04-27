import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login: setSession } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!formData.email || !formData.password) {
      return setError('Please fill in all fields');
    }
  
    try {
      const { data } = await api.post('/auth/login', formData);
      setSession(data);
  
      const role = data.user.role?.toLowerCase();
  
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'seller') {
        if (data.user.isApproved) {
          navigate('/seller', { replace: true });
        } else {
          setError('Your seller account is pending admin approval.');
        }
      } else if (role === 'customer' || !role) {
        navigate('/products', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
  
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xs" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Sign in to Shopfinity
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email or phone number"
              name="email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, mb: 1 }}
            >
              Continue
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              New to Shopfinity? <Link to="/register">Create account</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
