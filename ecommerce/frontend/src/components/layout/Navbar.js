import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem,
  Box, Button, Avatar, Drawer, List, ListItem, ListItemText,
  ListItemIcon, Divider, useMediaQuery, useTheme, InputBase,
} from '@mui/material';
import {
  ShoppingCart, FavoriteBorder, Person, Search, Menu as MenuIcon,
  Dashboard, Logout, ListAlt, Home, Store, AdminPanelSettings,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { userInfo } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { products: wishlistItems } = useSelector((state) => state.wishlist);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/');
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const navLinks = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <Store /> },
  ];

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#1a1a2e', boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <Toolbar sx={{ gap: 1 }}>
          {/* Mobile menu */}
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'white', fontWeight: 800, letterSpacing: 1, mr: 2, flexShrink: 0 }}
          >
            Shop<span style={{ color: '#e94560' }}>Wave</span>
          </Typography>

          {/* Desktop nav links */}
          {!isMobile && navLinks.map((link) => (
            <Button key={link.path} color="inherit" component={Link} to={link.path} sx={{ opacity: 0.9 }}>
              {link.label}
            </Button>
          ))}

          {/* Search bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flex: 1, mx: 2, display: 'flex', alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, px: 2, py: 0.5,
              maxWidth: 400,
            }}
          >
            <Search sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, fontSize: 20 }} />
            <InputBase
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: 'white', flex: 1, '& input::placeholder': { color: 'rgba(255,255,255,0.6)' } }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
            {/* Wishlist */}
            <IconButton color="inherit" component={Link} to="/wishlist">
              <Badge badgeContent={wishlistItems?.length || 0} color="error">
                <FavoriteBorder />
              </Badge>
            </IconButton>

            {/* Cart */}
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* User menu */}
            {userInfo ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: '#e94560', fontSize: 14 }}>
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      Hi, {userInfo.name?.split(' ')[0]}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                    <Person fontSize="small" sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/my-orders'); setAnchorEl(null); }}>
                    <ListAlt fontSize="small" sx={{ mr: 1 }} /> My Orders
                  </MenuItem>
                  {userInfo.role === 'admin' && (
                    <MenuItem onClick={() => { navigate('/admin'); setAnchorEl(null); }}>
                      <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} /> Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                to="/login"
                size="small"
                sx={{ ml: 1, borderColor: 'rgba(255,255,255,0.5)' }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, fontWeight: 800, color: '#1a1a2e', mb: 1 }}>
            Shop<span style={{ color: '#e94560' }}>Wave</span>
          </Typography>
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.path}
                button
                component={Link}
                to={link.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            {userInfo && (
              <>
                <ListItem button component={Link} to="/profile" onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon><Person /></ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button component={Link} to="/my-orders" onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon><ListAlt /></ListItemIcon>
                  <ListItemText primary="My Orders" />
                </ListItem>
                {userInfo.role === 'admin' && (
                  <ListItem button component={Link} to="/admin" onClick={() => setDrawerOpen(false)}>
                    <ListItemIcon><Dashboard /></ListItemIcon>
                    <ListItemText primary="Admin Panel" />
                  </ListItem>
                )}
                <Divider />
                <ListItem button onClick={() => { handleLogout(); setDrawerOpen(false); }}>
                  <ListItemIcon><Logout /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
