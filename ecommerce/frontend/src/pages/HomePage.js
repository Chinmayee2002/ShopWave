import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Container, Typography, Button, Grid, Chip,
  Card, CardContent, Stack, Paper,
} from '@mui/material';
import {
  LocalShipping, Shield, Headset, Replay,
  ArrowForward,
} from '@mui/icons-material';
import { fetchFeaturedProducts } from '../store/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import API from '../utils/axios';
import { useState } from 'react';

const features = [
  { icon: <LocalShipping sx={{ fontSize: 36, color: '#e94560' }} />, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: <Shield sx={{ fontSize: 36, color: '#e94560' }} />, title: 'Secure Payment', desc: '100% protected transactions' },
  { icon: <Headset sx={{ fontSize: 36, color: '#e94560' }} />, title: '24/7 Support', desc: 'Dedicated support team' },
  { icon: <Replay sx={{ fontSize: 36, color: '#e94560' }} />, title: 'Easy Returns', desc: '30-day return policy' },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredProducts, loading } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    API.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, [dispatch]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box sx={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400,
          borderRadius: '50%', bgcolor: 'rgba(233,69,96,0.08)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300,
          borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label="🔥 New Arrivals Just Dropped" sx={{ bgcolor: 'rgba(233,69,96,0.2)', color: '#e94560', mb: 3, fontWeight: 600 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Discover the Best{' '}
                <Box component="span" sx={{ color: '#e94560' }}>Products</Box>
                {' '}for You
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.75, mb: 4, fontWeight: 400, lineHeight: 1.6 }}>
                Shop thousands of products with fast delivery, secure payments, and hassle-free returns.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/products')}
                  sx={{ bgcolor: '#e94560', '&:hover': { bgcolor: '#c73652' }, px: 4, py: 1.5, fontSize: 16 }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/products')}
                  sx={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }, px: 4, py: 1.5 }}
                >
                  Browse All
                </Button>
              </Stack>

              <Stack direction="row" spacing={4} sx={{ mt: 5 }}>
                {[['50K+', 'Products'], ['2M+', 'Customers'], ['99%', 'Satisfaction']].map(([num, label]) => (
                  <Box key={label}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#e94560' }}>{num}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7 }}>{label}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {[
                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
                  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300',
                  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
                  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300',
                ].map((src, i) => (
                  <Box key={i} component="img" src={src} alt=""
                    sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 3,
                      transform: i % 2 === 1 ? 'translateY(20px)' : 'none',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Bar */}
      <Box sx={{ bgcolor: 'white', py: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {features.map((f) => (
              <Grid item xs={6} md={3} key={f.title}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {f.icon}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{f.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{f.desc}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      {categories.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700}>Shop by Category</Typography>
            <Button component={Link} to="/products" endIcon={<ArrowForward />} sx={{ color: '#e94560' }}>
              View All
            </Button>
          </Box>
          <Grid container spacing={2}>
            {categories.slice(0, 6).map((cat) => (
              <Grid item xs={6} sm={4} md={2} key={cat._id}>
                <Paper
                  component={Link}
                  to={`/products?category=${cat._id}`}
                  elevation={0}
                  sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, px: 1,
                    textDecoration: 'none', color: 'inherit', border: '1.5px solid #f0f0f0', borderRadius: 3,
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: '#e94560', bgcolor: 'rgba(233,69,96,0.04)', transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography variant="h4" sx={{ mb: 1 }}>
                    {['📱','👕','📚','🏠','⚽','💄'][categories.indexOf(cat)] || '🛍️'}
                  </Typography>
                  <Typography variant="body2" fontWeight={600} textAlign="center">{cat.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Featured Products */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight={700}>Featured Products</Typography>
              <Typography variant="body2" color="text.secondary">Handpicked items just for you</Typography>
            </Box>
            <Button component={Link} to="/products" endIcon={<ArrowForward />} sx={{ color: '#e94560' }}>
              View All
            </Button>
          </Box>
          {loading ? (
            <Loader />
          ) : featuredProducts.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={5}>No featured products yet.</Typography>
          ) : (
            <Grid container spacing={3}>
              {featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Banner CTA */}
      <Box sx={{ background: 'linear-gradient(135deg, #e94560 0%, #c73652 100%)', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" fontWeight={800} color="white" mb={2}>
            Ready to Start Shopping?
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.85)" mb={4} fontWeight={400}>
            Join millions of happy customers today
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/register"
            sx={{ bgcolor: 'white', color: '#e94560', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }, px: 5, py: 1.5, fontSize: 16, fontWeight: 700 }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
