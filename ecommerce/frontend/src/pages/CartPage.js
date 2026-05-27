import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Grid, Box, Typography, Button, IconButton,
  Paper, Divider, Chip, Stack,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag, ArrowForward } from '@mui/icons-material';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) dispatch(fetchCart());
  }, [dispatch, userInfo]);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await dispatch(updateCartItem({ productId, quantity: newQty })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
      toast.info('Item removed from cart');
    } catch { toast.error('Failed to remove item'); }
  };

  const handleClear = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      toast.info('Cart cleared');
    } catch { toast.error('Failed to clear cart'); }
  };

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `http://localhost:5000${img}` : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200';

  const shippingPrice = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingPrice + tax;

  if (!userInfo) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
        <Typography variant="h5" fontWeight={600} mb={2}>Please login to view your cart</Typography>
        <Button variant="contained" component={Link} to="/login" sx={{ bgcolor: '#1a1a2e' }}>Login</Button>
      </Container>
    );
  }

  if (loading) return <Loader />;

  if (!items || items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <ShoppingBag sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
        <Typography variant="h5" fontWeight={600} mb={1}>Your cart is empty</Typography>
        <Typography color="text.secondary" mb={4}>Add some products and they'll show up here.</Typography>
        <Button variant="contained" component={Link} to="/products" sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Shopping Cart <Chip label={`${items.length} items`} size="small" sx={{ ml: 1 }} />
      </Typography>

      <Grid container spacing={4}>
        {/* Cart items */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
            {items.map((item, index) => (
              <Box key={item.product?._id}>
                <Box sx={{ display: 'flex', gap: 2, p: 2.5, alignItems: 'center' }}>
                  <Box component="img"
                    src={imageUrl(item.product?.images?.[0])}
                    alt={item.product?.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200'; }}
                    sx={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap
                      component={Link} to={`/products/${item.product?._id}`}
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: '#e94560' } }}>
                      {item.product?.name}
                    </Typography>
                    <Typography variant="h6" color="#e94560" fontWeight={700} mt={0.5}>
                      ${item.price?.toFixed(2)}
                    </Typography>
                    {item.product?.stock < 5 && item.product?.stock > 0 && (
                      <Chip label={`Only ${item.product.stock} left`} size="small" color="warning" sx={{ mt: 0.5 }} />
                    )}
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                      <IconButton size="small" onClick={() => handleQuantityChange(item.product?._id, item.quantity - 1)} sx={{ px: 1 }}>
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ px: 1.5, minWidth: 28, textAlign: 'center' }}>{item.quantity}</Typography>
                      <IconButton size="small"
                        onClick={() => handleQuantityChange(item.product?._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product?.stock}
                        sx={{ px: 1 }}>
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ minWidth: 70, textAlign: 'right' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton color="error" size="small" onClick={() => handleRemove(item.product?._id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
                {index < items.length - 1 && <Divider />}
              </Box>
            ))}
            <Box sx={{ p: 2, bgcolor: '#fafafa', display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="error" size="small" startIcon={<Delete />} onClick={handleClear}>Clear Cart</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Order summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Order Summary</Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</Typography>
                <Typography fontWeight={600}>${totalPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight={600} color={shippingPrice === 0 ? 'success.main' : 'inherit'}>
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax (8%)</Typography>
                <Typography fontWeight={600}>${tax.toFixed(2)}</Typography>
              </Box>
              {shippingPrice > 0 && (
                <Chip label={`Add $${(50 - totalPrice).toFixed(2)} more for free shipping!`}
                  color="info" size="small" variant="outlined" sx={{ fontSize: 11 }} />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#e94560">${orderTotal.toFixed(2)}</Typography>
            </Box>

            <Button fullWidth variant="contained" size="large" endIcon={<ArrowForward />}
              onClick={() => navigate('/checkout')}
              sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' }, py: 1.5, fontSize: 16 }}>
              Proceed to Checkout
            </Button>
            <Button fullWidth component={Link} to="/products" sx={{ mt: 1, color: 'text.secondary' }}>
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
