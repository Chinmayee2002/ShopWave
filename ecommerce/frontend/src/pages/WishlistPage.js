import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Box, Typography, Button } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) dispatch(fetchWishlist());
  }, [dispatch, userInfo]);

  if (!userInfo) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Favorite sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
        <Typography variant="h5" fontWeight={600} mb={2}>Please login to view your wishlist</Typography>
        <Button variant="contained" onClick={() => navigate('/login')} sx={{ bgcolor: '#1a1a2e' }}>Login</Button>
      </Container>
    );
  }

  if (loading) return <Loader />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>My Wishlist</Typography>
      <Typography color="text.secondary" mb={4}>{products?.length || 0} saved items</Typography>

      {!products || products.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Favorite sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} mb={1}>Your wishlist is empty</Typography>
          <Typography color="text.secondary" mb={4}>Save items you love and find them here later.</Typography>
          <Button variant="contained" component={Link} to="/products" sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
            Browse Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WishlistPage;
