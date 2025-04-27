// frontend/src/components/SellerDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocalShipping as ShipIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

// TabPanel helper
function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ p: 3 }}>{children}</Box> : null;
}

export default function SellerDashboard() {
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);

  // Products state
  const [products, setProducts] = useState([]);
  // Orders state
  const [orders, setOrders] = useState([]);

  // Product form state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    countInStock: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // 1) Fetch seller products
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/seller/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 2) Fetch seller orders
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/seller/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  // 3) File‐picker → direct Cloudinary upload
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);
    data.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const json = await res.json();
      if (json.secure_url) {
        setForm((f) => ({ ...f, image: json.secure_url }));
      } else {
        console.error('Cloudinary upload failed', json);
        console.error('Error details:', json.error);
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    }
  };

  // 4) Mark order as shipped
  const markAsShipped = async (orderId) => {
    try {
      await api.put(`/seller/orders/${orderId}`, { status: 'Shipped' });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Rest of your existing handlers:
  const handleTabChange = (_, v) => setTabValue(v);

  const openForm = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setForm({ ...prod });
    } else {
      setEditingProduct(null);
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        countInStock: '',
      });
    }
    setOpenDialog(true);
  };

  const closeForm = () => setOpenDialog(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const saveProduct = async () => {
    try {
      if (editingProduct) {
        await api.put(`/seller/products/${editingProduct._id}`, form);
      } else {
        await api.post('/seller/products', form);
      }
      fetchProducts();
      closeForm();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/seller/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }} maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>
      </Box>

      {/* PRODUCTS TAB */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => openForm()}
          >
            Add New Product
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>${p.price.toFixed(2)}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.countInStock}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => openForm(p)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteProduct(p._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={closeForm} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            {/*  -- NEW: file input + preview -- */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ margin: '16px 0' }}
            />
            {form.image && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Preview:</Typography>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}

            {/* You can still let them override the URL if you like */}
            <TextField
              fullWidth
              label="Image URL"
              name="image"
              margin="dense"
              value={form.image}
              onChange={handleChange}
            />

            {['name', 'description', 'category'].map((field) => (
              <TextField
                key={field}
                fullWidth
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                margin="dense"
                value={form[field]}
                onChange={handleChange}
              />
            ))}

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Stock"
                  name="countInStock"
                  value={form.countInStock}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeForm}>Cancel</Button>
            <Button variant="contained" onClick={saveProduct}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* ORDERS TAB */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No orders yet
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow key={o._id}>
                    <TableCell>{o._id}</TableCell>
                    <TableCell>
                      {o.user.firstName} {o.user.lastName}
                    </TableCell>
                    <TableCell>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${o.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{o.status}</TableCell>
                    <TableCell>
                      {o.status === 'Processing' && (
                        <Button
                          startIcon={<ShipIcon />}
                          onClick={() => markAsShipped(o._id)}
                        >
                          Mark as Shipped
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Container>
  );
}
