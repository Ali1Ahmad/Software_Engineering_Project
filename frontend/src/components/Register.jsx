import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login: setSession } = useContext(AuthContext);

  const [role, setRole] = useState('customer');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password) {
      return setError('All fields are required');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const { data } = await api.post('/auth/register', {
        name: `${firstName} ${lastName}`,
        email,
        password,
        role
      });
      setSession(data);
      // Redirect based on role
      if (role === 'customer') {
        navigate('/products');
      } else if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        {/* Back Button */}
        <Box sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate('/login')}
            sx={{ color: 'text.primary', p: 0 }}
          >
            <ArrowBackIcon />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Back to Login
            </Typography>
          </IconButton>
        </Box>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src="/logo.png" alt="Shopfinity" style={{ width: 120 }} />
        </Box>

        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Create your Shopfinity account
        </Typography>

        {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel>I am a…</InputLabel>
            <Select
              value={role}
              label="I am a…"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="seller">Seller</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Name Fields */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Email + Password Fields */}
          <TextField
            fullWidth
            label="Email"
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
          <TextField
            fullWidth
            label="Re-enter password"
            name="confirmPassword"
            type="password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3, py: 1.5 }}
          >
            Continue
          </Button>
        </form>

        {/* Link to Login */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Sign-In</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
