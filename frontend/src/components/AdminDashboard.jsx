import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography } from '@mui/material';
import ManageSellers from './ManageSellers';
import ManageProducts from './ManageProducts';
import AdminOrders from './AdminOrders'; // 👈 Import the new Manage Orders component

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Manage Sellers" />
          <Tab label="Manage Products" />
          <Tab label="Manage Orders" />
        </Tabs>
      </Box>

      <Box>
        {tab === 0 && <ManageSellers />}
        {tab === 1 && <ManageProducts />}
        {tab === 2 && <AdminOrders />}
      </Box>
    </Container>
  );
}
