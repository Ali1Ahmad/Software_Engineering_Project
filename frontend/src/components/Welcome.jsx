// frontend/src/components/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper 
} from '@mui/material';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          maxWidth: '600px !important'
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            textAlign: 'center',
            borderRadius: 2,
            width: '100%',
            maxWidth: '500px',
            bgcolor: 'background.paper'
          }}
        >
          <Typography 
            variant="h3" 
            component="h1"
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Welcome to Shopfinity
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 4,
              color: 'text.secondary'
            }}
          >
            Your one-stop shop for everything you need.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Button 
              variant="contained" 
              size="large"
              fullWidth
              onClick={() => navigate('/login')}
              sx={{ 
                py: 1.5,
                px: 4
              }}
            >
              Login
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              fullWidth
              onClick={() => navigate('/register')}
              sx={{ 
                py: 1.5,
                px: 4
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
