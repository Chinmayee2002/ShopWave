import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Grid, Box, Typography, TextField, Button, Paper,
  Divider, Stepper, Step, StepLabel, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, Stack,
} from '@mui/material';
import { CreditCard, LocalShipping, CheckCircle } from '@mui/icons-material';
import { fetchCart } from '../store/slices/cartSlice';
import { createOrder, clearOrderSuccess } from '../store/slices/orderSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const steps = ['Shipping', 'Payment', 'Confirm'];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, order, success } = useSelector((state) => state.orders);

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userInfo?.name || '',
    address: userInfo?.address?.street || '',
    city: userInfo?.address?.city || '',
    state: userInfo?.address?.state || '',
    zipCode: userInfo?.address?.zipCode || '',
    country: userInfo?.address?.country || 'USA',
    phone: userInfo?.phone || '',
  });

  const shippingPrice = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shippingPrice + tax;

  useEffect(() => {
    dispatch(fetchCart());
    return () => dispatch(clearOrderSuccess());
  }, [dispatch]);

  useEffect(() => {
    if (success && order) navigate(`/order-success/${order._id}`);
  }, [success, order, navigate]);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    const { fullName, address, city, state, zipCode, country, phone } = shippingAddress;
    if (!fullName || !address || !city || !state || !zipCode || !country || !phone) {
      toast.error('Please fill all shipping fields');
      return;
    }
    setActiveStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!items || items.length === 0) { toast.error('Your cart is empty'); return; }
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        price: item.price,
        quantity: item.quantity,
      }));

      await dispatch(createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice,
        taxPrice: tax,
        totalPrice: orderTotal,
      })).unwrap();

      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `http://localhost:5000${img}` : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80';

  if (!items || items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" mb={2}>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ bgcolor: '#1a1a2e' }}>Shop Now</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>Checkout</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {/* Step 1: Shipping */}
          {activeStep === 0 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping color="action" /> Shipping Address
              </Typography>
              <Box component="form" onSubmit={handleShippingSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth label="Full Name" required value={shippingAddress.fullName} onChange={(e) => setShippingAddress((s) => ({ ...s, fullName: e.target.value }))} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Phone Number" required value={shippingAddress.phone} onChange={(e) => setShippingAddress((s) => ({ ...s, phone: e.target.value }))} /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Street Address" required value={shippingAddress.address} onChange={(e) => setShippingAddress((s) => ({ ...s, address: e.target.value }))} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="City" required value={shippingAddress.city} onChange={(e) => setShippingAddress((s) => ({ ...s, city: e.target.value }))} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="State" required value={shippingAddress.state} onChange={(e) => setShippingAddress((s) => ({ ...s, state: e.target.value }))} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="ZIP Code" required value={shippingAddress.zipCode} onChange={(e) => setShippingAddress((s) => ({ ...s, zipCode: e.target.value }))} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Country" required value={shippingAddress.country} onChange={(e) => setShippingAddress((s) => ({ ...s, country: e.target.value }))} /></Grid>
                </Grid>
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 3, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
                  Continue to Payment
                </Button>
              </Box>
            </Paper>
          )}

          {/* Step 2: Payment */}
          {activeStep === 1 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreditCard color="action" /> Payment Method
              </Typography>
              <FormControl>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, borderColor: paymentMethod === 'cod' ? '#1a1a2e' : '#e0e0e0' }}>
                    <FormControlLabel value="cod" control={<Radio />} label={
                      <Box><Typography fontWeight={600}>Cash on Delivery</Typography><Typography variant="body2" color="text.secondary">Pay when your order arrives</Typography></Box>
                    } />
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2, borderColor: paymentMethod === 'card' ? '#1a1a2e' : '#e0e0e0' }}>
                    <FormControlLabel value="card" control={<Radio />} label={
                      <Box><Typography fontWeight={600}>Credit / Debit Card</Typography><Typography variant="body2" color="text.secondary">Demo mode — no real charge</Typography></Box>
                    } />
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2, borderColor: paymentMethod === 'upi' ? '#1a1a2e' : '#e0e0e0' }}>
                    <FormControlLabel value="upi" control={<Radio />} label={
                      <Box><Typography fontWeight={600}>UPI Payment</Typography><Typography variant="body2" color="text.secondary">Pay via UPI (Demo)</Typography></Box>
                    } />
                  </Paper>
                </RadioGroup>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setActiveStep(0)} sx={{ flex: 1 }}>Back</Button>
                <Button variant="contained" onClick={() => setActiveStep(2)} sx={{ flex: 2, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
                  Review Order
                </Button>
              </Box>
            </Paper>
          )}

          {/* Step 3: Confirm */}
          {activeStep === 2 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="action" /> Order Confirmation
              </Typography>

              <Typography variant="subtitle2" fontWeight={700} mb={1}>Shipping To</Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}, {shippingAddress.country} · {shippingAddress.phone}
              </Typography>

              <Typography variant="subtitle2" fontWeight={700} mb={1}>Payment</Typography>
              <Typography variant="body2" color="text.secondary" mb={3} textTransform="capitalize">{paymentMethod}</Typography>

              <Typography variant="subtitle2" fontWeight={700} mb={2}>Items</Typography>
              {items.map((item) => (
                <Box key={item.product?._id} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <Box component="img" src={imageUrl(item.product?.images?.[0])} sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }} />
                  <Box flex={1}><Typography variant="body2" fontWeight={600} noWrap>{item.product?.name}</Typography></Box>
                  <Typography variant="body2">{item.quantity} × ${item.price?.toFixed(2)}</Typography>
                </Box>
              ))}

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" onClick={() => setActiveStep(1)} sx={{ flex: 1 }}>Back</Button>
                <Button variant="contained" size="large" onClick={handlePlaceOrder} disabled={loading} sx={{ flex: 2, bgcolor: '#e94560', '&:hover': { bgcolor: '#c73652' } }}>
                  {loading ? 'Placing Order...' : `Place Order · $${orderTotal.toFixed(2)}`}
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Order summary sidebar */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Order Summary</Typography>
            {items.slice(0, 3).map((item) => (
              <Box key={item.product?._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>{item.product?.name} ×{item.quantity}</Typography>
                <Typography variant="body2" fontWeight={600}>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}
            {items.length > 3 && <Typography variant="body2" color="text.secondary">+{items.length - 3} more items</Typography>}
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Subtotal</Typography><Typography>${totalPrice.toFixed(2)}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Shipping</Typography><Typography color={shippingPrice === 0 ? 'success.main' : 'inherit'}>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography color="text.secondary">Tax</Typography><Typography>${tax.toFixed(2)}</Typography></Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#e94560">${orderTotal.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
