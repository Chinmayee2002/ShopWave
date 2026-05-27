import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, Divider, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#1a1a2e', color: 'rgba(255,255,255,0.8)', mt: 'auto', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
              Shop<span style={{ color: '#e94560' }}>Wave</span>
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8 }}>
              Your one-stop destination for all your shopping needs. Quality products, fast delivery, and excellent customer service.
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, i) => (
                <IconButton key={i} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#e94560' } }}>
                  <Icon />
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>Shop</Typography>
            {['Products', 'Categories', 'Deals', 'New Arrivals'].map((item) => (
              <Typography key={item} variant="body2" component={Link} to="/products"
                sx={{ display: 'block', mb: 1, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: '#e94560' } }}>
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>Account</Typography>
            {[['My Profile', '/profile'], ['My Orders', '/my-orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([label, path]) => (
              <Typography key={label} variant="body2" component={Link} to={path}
                sx={{ display: 'block', mb: 1, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: '#e94560' } }}>
                {label}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>Contact</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>📧 support@shopwave.com</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>📞 +1 (800) SHOPWAVE</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>🕐 Mon–Fri, 9am–6pm EST</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            © {new Date().getFullYear()} ShopWave. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            Built with React · Node.js · MongoDB
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
