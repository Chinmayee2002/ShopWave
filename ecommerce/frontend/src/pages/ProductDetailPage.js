import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Grid, Box, Typography, Button, Chip, Rating,
  Divider, TextField, Tab, Tabs, Paper, Avatar, IconButton, Breadcrumbs, Link,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder, Add, Remove, ArrowBack } from '@mui/icons-material';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import API from '../utils/axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const { products: wishlistProducts } = useSelector((state) => state.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const isWishlisted = wishlistProducts?.some((p) => p._id === id);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (!product) return <Box textAlign="center" py={10}><Typography>Product not found.</Typography></Box>;

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `http://localhost:5000${img}` : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600';

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.info('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist!');
      }
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleSubmitReview = async () => {
    if (!userInfo) { navigate('/login'); return; }
    try {
      await API.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      dispatch(fetchProductById(id));
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" underline="hover" color="inherit">Home</Link>
        <Link href="/products" underline="hover" color="inherit">Products</Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3, color: 'text.secondary' }}>
        Back
      </Button>

      <Grid container spacing={5}>
        {/* Images */}
        <Grid item xs={12} md={6}>
          <Box component="img"
            src={imageUrl(product.images?.[selectedImage])}
            alt={product.name}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'; }}
            sx={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          {product.images?.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
              {product.images.map((img, i) => (
                <Box key={i} component="img" src={imageUrl(img)} alt={`thumb-${i}`}
                  onClick={() => setSelectedImage(i)}
                  sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 2, cursor: 'pointer',
                    border: selectedImage === i ? '2.5px solid #e94560' : '2px solid transparent',
                    opacity: selectedImage === i ? 1 : 0.7, transition: '0.2s',
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Chip label={product.category?.name} size="small" sx={{ mb: 1, bgcolor: '#f0f0f0' }} />
          {product.brand && <Chip label={product.brand} size="small" sx={{ mb: 1, ml: 1, bgcolor: '#f0f0f0' }} />}

          <Typography variant="h4" fontWeight={700} mt={1} mb={2}>{product.name}</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">({product.numReviews} reviews)</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h4" fontWeight={800} color="#e94560">${product.price?.toFixed(2)}</Typography>
            {product.originalPrice > product.price && (
              <>
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  ${product.originalPrice?.toFixed(2)}
                </Typography>
                <Chip label={`${discount}% OFF`} color="error" size="small" sx={{ fontWeight: 700 }} />
              </>
            )}
          </Box>

          <Typography variant="body1" color="text.secondary" mb={3} lineHeight={1.8}>
            {product.description}
          </Typography>

          {/* Stock */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Chip
              label={product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              color={product.stock > 0 ? 'success' : 'error'}
              variant="outlined" size="small"
            />
            {product.stock > 0 && product.stock <= 5 && (
              <Chip label="Only a few left!" color="warning" size="small" />
            )}
          </Box>

          {/* Quantity selector */}
          {product.stock > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600}>Quantity:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.max(1, q - 1))} sx={{ px: 1.5 }}>
                  <Remove fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2, minWidth: 30, textAlign: 'center' }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} sx={{ px: 1.5 }}>
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" startIcon={<ShoppingCart />}
              onClick={handleAddToCart} disabled={product.stock === 0}
              sx={{ flex: 1, minWidth: 180, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' }, py: 1.5 }}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button variant="outlined" size="large"
              startIcon={isWishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
              onClick={handleToggleWishlist}
              sx={{ borderColor: isWishlisted ? '#e94560' : '#ddd', color: isWishlisted ? '#e94560' : 'inherit' }}>
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </Button>
          </Box>

          {product.stock > 0 && (
            <Button variant="contained" size="large" fullWidth
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
              sx={{ mt: 2, bgcolor: '#e94560', '&:hover': { bgcolor: '#c73652' }, py: 1.5 }}>
              Buy Now
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Tabs: Description & Reviews */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Description" />
          <Tab label={`Reviews (${product.numReviews})`} />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ py: 3 }}>
            <Typography variant="body1" lineHeight={1.9} color="text.secondary">{product.description}</Typography>
            {product.tags?.length > 0 && (
              <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {product.tags.map((tag) => <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />)}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box sx={{ py: 3 }}>
            {/* Review form */}
            {userInfo && (
              <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>Write a Review</Typography>
                <Rating value={reviewForm.rating} onChange={(_, v) => setReviewForm((f) => ({ ...f, rating: v }))} size="large" sx={{ mb: 2 }} />
                <TextField fullWidth multiline rows={3} placeholder="Share your experience..."
                  value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} sx={{ mb: 2 }} />
                <Button variant="contained" onClick={handleSubmitReview} disabled={!reviewForm.comment}
                  sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
                  Submit Review
                </Button>
              </Paper>
            )}

            {product.reviews?.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>No reviews yet. Be the first to review!</Typography>
            ) : (
              product.reviews.map((review) => (
                <Box key={review._id} sx={{ mb: 3, pb: 3, borderBottom: '1px solid #f0f0f0' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ bgcolor: '#1a1a2e', width: 36, height: 36, fontSize: 14 }}>
                      {review.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{review.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} size="small" readOnly sx={{ ml: 'auto' }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" ml={6.5}>{review.comment}</Typography>
                </Box>
              ))
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
