import React from 'react';
import { Container, Typography } from '@mui/material';

export default function AdminDashboard() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography color="text.secondary">
        (Coming soon—admin functionality not implemented yet.)
      </Typography>
    </Container>
  );
}
