import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, IconButton, Typography, Badge,
  Drawer, List, ListItem, ListItemText, Container,
  Grid, Card, CardMedia, CardContent, Button, Box,
  Link, TextField, InputAdornment, Select, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function ProductList() {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const { logout } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  const handleDrawerToggle = () => setMobileOpen(open => !open);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <Link component={RouterLink} to="/">
          <img src="/logo.png" alt="Shopfinity" style={{ height: 40 }} />
        </Link>
      </Typography>
      <List>
        {[
          { text: 'Home', to: '/products' },
          { text: `Cart (${cartItems.length})`, to: '/cart' },
          { text: 'My Orders', to: '/myorders' },
          { text: 'Profile', to: '/profile' },
        ].map(item => (
          <ListItem key={item.text} component={RouterLink} to={item.to} sx={{ cursor: 'pointer' }}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
          <ExitToAppIcon sx={{ mr: 1 }} />
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  // --- Search and Filter Logic ---
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrice = (() => {
      if (selectedPrice === 'all') return true;
      if (selectedPrice === 'under50') return p.price < 50;
      if (selectedPrice === '50to100') return p.price >= 50 && p.price <= 100;
      if (selectedPrice === '100to200') return p.price > 100 && p.price <= 200;
      if (selectedPrice === 'above200') return p.price > 200;
      return true;
    })();

    const matchesRating = (() => {
      if (selectedRating === 'all') return true;
      if (!p.rating) return false;
      const rating = Math.floor(p.rating);
      return rating >= parseInt(selectedRating);
    })();

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Link
            component={RouterLink}
            to="/products"
            sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            <img src="/logo.png" alt="Shopfinity" style={{ height: 40, marginRight: 8 }} />
            <Typography variant="h6">Shopfinity</Typography>
          </Link>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Button color="inherit" component={RouterLink} to="/products">Home</Button>
            <IconButton color="inherit" component={RouterLink} to="/cart">
              <Badge badgeContent={cartItems.length} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <Button color="inherit" component={RouterLink} to="/myorders">My Orders</Button>
            <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
            <IconButton color="inherit" onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Browse Products
        </Typography>

        {/* Search + Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="fashion">Fashion</MenuItem>
            <MenuItem value="toys">Toys</MenuItem>
            <MenuItem value="books">Books</MenuItem>
          </Select>

          <Select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            displayEmpty
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Prices</MenuItem>
            <MenuItem value="under50">Under $50</MenuItem>
            <MenuItem value="50to100">$50 - $100</MenuItem>
            <MenuItem value="100to200">$100 - $200</MenuItem>
            <MenuItem value="above200">Above $200</MenuItem>
          </Select>

          <Select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            displayEmpty
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Ratings</MenuItem>
            <MenuItem value="4">4 ★ & up</MenuItem>
            <MenuItem value="3">3 ★ & up</MenuItem>
            <MenuItem value="2">2 ★ & up</MenuItem>
            <MenuItem value="1">1 ★ & up</MenuItem>
          </Select>
        </Box>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <Grid container spacing={3}>
            {filteredProducts.map((p) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={p.image}
                    alt={p.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap>{p.name}</Typography>
                    <Typography color="text.secondary">${p.price}</Typography>
                    {p.rating && (
                      <Typography variant="body2" color="text.secondary">
                        {p.rating.toFixed(1)} ★
                      </Typography>
                    )}
                    <Button
                      component={RouterLink}
                      to={`/product/${p._id}`}
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" color="text.secondary" align="center">
            No products match your filters.
          </Typography>
        )}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
        <Typography variant="body2">&copy; {new Date().getFullYear()} Shopfinity</Typography>
        <Box>
          <Link component={RouterLink} to="/profile" sx={{ mx: 1 }}>
            Profile
          </Link>
          |
          <Link component={RouterLink} to="/myorders" sx={{ mx: 1 }}>
            Orders
          </Link>
          |
          <Link component={RouterLink} to="/checkout" sx={{ mx: 1 }}>
            Checkout
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
