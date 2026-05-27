// OrderSuccessPage.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box, Typography, Button, Paper, Stack } from '@mui/material';
import { CheckCircle, ListAlt, Home } from '@mui/icons-material';
import { fetchOrderById } from '../store/slices/orderSlice';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchOrderById(id)); }, [dispatch, id]);

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
      <CheckCircle sx={{ fontSize: 90, color: '#4caf50', mb: 3 }} />
      <Typography variant="h4" fontWeight={800} mb={1}>Order Placed!</Typography>
      <Typography color="text.secondary" mb={1}>Thank you for your order.</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Order ID: <strong>#{id?.slice(-8).toUpperCase()}</strong>
      </Typography>
      {order && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 4, textAlign: 'left' }}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>Order Summary</Typography>
          <Typography><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</Typography>
          <Typography><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}</Typography>
          <Typography><strong>Status:</strong> {order.orderStatus?.toUpperCase()}</Typography>
        </Paper>
      )}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" startIcon={<ListAlt />} onClick={() => navigate('/my-orders')}
          sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
          My Orders
        </Button>
        <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>
          Home
        </Button>
      </Stack>
    </Container>
  );
};

export default OrderSuccessPage;
