import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Grid, Box, Typography, Paper, Chip,
  Button, Divider, Stack,
} from '@mui/material';
import { ArrowBack, CreditCard } from '@mui/icons-material';
import { fetchOrderById, payOrder } from '../store/slices/orderSlice';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const statusColors = { pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error' };

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [dispatch, id]);

  const handlePayNow = async () => {
    try {
      await dispatch(payOrder(id)).unwrap();
      toast.success('Payment successful! (Demo)');
    } catch (err) {
      toast.error(err || 'Payment failed');
    }
  };

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `http://localhost:5000${img}` : 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=80';

  if (loading) return <Loader />;
  if (!order) return <Box textAlign="center" py={10}><Typography>Order not found.</Typography></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/my-orders')} sx={{ mb: 3, color: 'text.secondary' }}>
        Back to Orders
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Order #{order._id?.slice(-8).toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>
        <Chip label={order.orderStatus} color={statusColors[order.orderStatus] || 'default'} size="medium" sx={{ textTransform: 'capitalize', fontWeight: 700, px: 1 }} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {/* Order items */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Order Items</Typography>
            {order.orderItems?.map((item, i) => (
              <Box key={i}>
                <Box sx={{ display: 'flex', gap: 2, py: 2, alignItems: 'center' }}>
                  <Box component="img" src={imageUrl(item.image)} alt={item.name}
                    sx={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 2 }} />
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantity} × ${item.price?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
                {i < order.orderItems.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>

          {/* Shipping address */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Shipping Address</Typography>
            <Typography>{order.shippingAddress?.fullName}</Typography>
            <Typography color="text.secondary">{order.shippingAddress?.address}</Typography>
            <Typography color="text.secondary">
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </Typography>
            <Typography color="text.secondary">{order.shippingAddress?.country}</Typography>
            <Typography color="text.secondary">📞 {order.shippingAddress?.phone}</Typography>
          </Paper>

          {/* Payment info */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Payment Info</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <CreditCard color="action" />
              <Box>
                <Typography fontWeight={600} textTransform="capitalize">{order.paymentMethod}</Typography>
                <Chip label={order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                  color={order.isPaid ? 'success' : 'warning'} size="small" variant="outlined" />
              </Box>
            </Stack>
            {!order.isPaid && order.paymentMethod !== 'cod' && (
              <Button variant="contained" startIcon={<CreditCard />} onClick={handlePayNow} sx={{ mt: 2, bgcolor: '#e94560', '&:hover': { bgcolor: '#c73652' } }}>
                Pay Now (Demo)
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, position: 'sticky', top: 80 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Price Summary</Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Items</Typography>
                <Typography>${order.itemsPrice?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Shipping</Typography>
                <Typography color={order.shippingPrice === 0 ? 'success.main' : 'inherit'}>
                  {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice?.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography color="text.secondary">Tax</Typography>
                <Typography>${order.taxPrice?.toFixed(2)}</Typography>
              </Box>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="#e94560">${order.totalPrice?.toFixed(2)}</Typography>
            </Box>

            {/* Order timeline */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f0f0f0' }}>
              <Typography variant="subtitle2" fontWeight={700} mb={2}>Order Timeline</Typography>
              {[
                { label: 'Order Placed', done: true, date: order.createdAt },
                { label: 'Processing', done: ['processing','shipped','delivered'].includes(order.orderStatus) },
                { label: 'Shipped', done: ['shipped','delivered'].includes(order.orderStatus) },
                { label: 'Delivered', done: order.orderStatus === 'delivered', date: order.deliveredAt },
              ].map((step, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', mt: 0.6, flexShrink: 0,
                    bgcolor: step.done ? '#4caf50' : '#e0e0e0' }} />
                  <Box>
                    <Typography variant="body2" fontWeight={step.done ? 600 : 400} color={step.done ? 'text.primary' : 'text.secondary'}>
                      {step.label}
                    </Typography>
                    {step.date && (
                      <Typography variant="caption" color="text.secondary">
                        {new Date(step.date).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
