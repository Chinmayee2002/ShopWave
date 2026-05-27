import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardMedia, CardContent, CardActions, Typography,
  IconButton, Button, Box, Chip, Rating, Tooltip,
} from '@mui/material';
import { FavoriteBorder, Favorite, ShoppingCart, Visibility } from '@mui/icons-material';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { products: wishlistProducts } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistProducts?.some((p) => p._id === product._id);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userInfo) { navigate('/login'); return; }
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (!userInfo) { navigate('/login'); return; }
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.info('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist!');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const imageUrl = product.images?.[0]?.startsWith('http')
    ? product.images[0]
    : product.images?.[0]
    ? `http://localhost:5000${product.images[0]}`
    : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400';

  return (
    <Card
      sx={{
        height: '100%', display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' },
        position: 'relative',
      }}
    >
      {/* Discount badge */}
      {discount > 0 && (
        <Chip
          label={`-${discount}%`}
          color="error"
          size="small"
          sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, fontWeight: 700 }}
        />
      )}

      {/* Out of stock badge */}
      {product.stock === 0 && (
        <Chip
          label="Out of Stock"
          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 11 }}
          size="small"
        />
      )}

      {/* Wishlist button */}
      <Tooltip title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
        <IconButton
          onClick={handleToggleWishlist}
          sx={{
            position: 'absolute', top: 8, right: 8, zIndex: 1,
            bgcolor: 'white', boxShadow: 1,
            '&:hover': { bgcolor: 'white' },
          }}
          size="small"
        >
          {isWishlisted ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
        </IconButton>
      </Tooltip>

      {/* Product image */}
      <CardMedia
        component={Link}
        to={`/products/${product._id}`}
        sx={{ display: 'block' }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400'; }}
          sx={{ width: '100%', height: 220, objectFit: 'cover' }}
        />
      </CardMedia>

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {product.category?.name || 'General'}
        </Typography>
        <Typography
          variant="subtitle1"
          component={Link}
          to={`/products/${product._id}`}
          sx={{ display: 'block', fontWeight: 600, textDecoration: 'none', color: 'inherit', mb: 0.5, lineHeight: 1.3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">({product.numReviews || 0})</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" color="secondary" sx={{ fontWeight: 700 }}>
            ${product.price?.toFixed(2)}
          </Typography>
          {product.originalPrice > product.price && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${product.originalPrice?.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Tooltip title="View Details">
          <IconButton component={Link} to={`/products/${product._id}`} size="small" sx={{ border: '1px solid #e0e0e0' }}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
