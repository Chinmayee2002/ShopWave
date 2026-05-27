import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, IconButton, useMediaQuery, useTheme, Tooltip,
} from '@mui/material';
import {
  Dashboard, Inventory, ShoppingBag, People,
  Logout, Menu as MenuIcon, Store,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: <Dashboard /> },
  { label: 'Products', path: '/admin/products', icon: <Inventory /> },
  { label: 'Orders', path: '/admin/orders', icon: <ShoppingBag /> },
  { label: 'Users', path: '/admin/users', icon: <People /> },
];

const AdminLayout = ({ children, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { userInfo } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out');
    navigate('/');
  };

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a2e' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Store sx={{ color: '#e94560' }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
          Shop<span style={{ color: '#e94560' }}>Wave</span>
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Admin info */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: '#e94560', width: 36, height: 36, fontSize: 14 }}>
          {userInfo?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{userInfo?.name}</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Administrator</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Nav items */}
      <List sx={{ flex: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                mx: 1, borderRadius: 2, mb: 0.5,
                bgcolor: isActive ? 'rgba(233,69,96,0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#e94560' : 'rgba(255,255,255,0.6)', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ color: isActive ? 'white' : 'rgba(255,255,255,0.7)', fontWeight: isActive ? 700 : 400, fontSize: 14 }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Store link & logout */}
      <List sx={{ pb: 1 }}>
        <ListItem button component={Link} to="/" sx={{ mx: 1, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 40 }}><Store /></ListItemIcon>
          <ListItemText primary="View Store" primaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }} />
        </ListItem>
        <ListItem button onClick={handleLogout} sx={{ mx: 1, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: 40 }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' } }}>
          <DrawerContent />
        </Drawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
          <DrawerContent />
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <Box sx={{ bgcolor: 'white', px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 2,
          borderBottom: '1px solid #e0e0e0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          {isMobile && (
            <IconButton onClick={() => setMobileOpen(true)}><MenuIcon /></IconButton>
          )}
          <Typography variant="h5" fontWeight={700}>{title}</Typography>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
