import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Button, Chip, CircularProgress } from '@mui/material';
import api from '../services/api';

export default function ManageSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      const res = await api.get('/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellers(res.data);
    } catch (err) {
      console.error('Error fetching sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await api.put(`/admin/sellers/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSellers();
    } catch (err) {
      console.error('Error approving seller:', err);
    }
  };

  const handleDisapprove = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      await api.put(`/admin/sellers/${id}/disapprove`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSellers();
    } catch (err) {
      console.error('Error disapproving seller:', err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Status</TableCell>
          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {sellers.map((seller) => (
          <TableRow key={seller._id}>
            <TableCell>{seller.name}</TableCell>
            <TableCell>{seller.email}</TableCell>
            <TableCell>
              <Chip
                label={seller.isApproved ? 'Approved' : 'Pending'}
                color={seller.isApproved ? 'success' : 'warning'}
              />
            </TableCell>
            <TableCell align="center">
              {seller.isApproved ? (
                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => handleDisapprove(seller._id)}
                >
                  Disapprove
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleApprove(seller._id)}
                >
                  Approve
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
