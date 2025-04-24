import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
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
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

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
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Grid container>
        {/* Left side: form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <Container maxWidth="xs">
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <img src="/logo.png" alt="Shopfinity" style={{ width: 120 }} />
            </Box>

            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Create your Shopfinity account
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <form onSubmit={handleSubmit}>
                {/* Role selector */}
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
                  sx={{ mt: 3, mb: 1 }}
                >
                  Continue
                </Button>
              </form>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Already have an account? <Link to="/login">Sign-In</Link>
                </Typography>
              </Box>
            </Paper>
          </Container>
        </Grid>

        {/* Right side: hero image */}
        <Grid
          item
          xs={0}
          md={6}
          sx={{
            display: { xs: 'none', md: 'block' },
            backgroundImage: 'url(/signup_image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
          }}
        />
      </Grid>
    </Box>
  );
}
