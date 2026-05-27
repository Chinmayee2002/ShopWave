import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Typography, Box, Paper, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { Visibility, ShoppingBag } from '@mui/icons-material';
import { fetchMyOrders } from '../store/slices/orderSlice';
import Loader from '../components/common/Loader';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>My Orders</Typography>

      {!orders || orders.length === 0 ? (
        <Box textAlign="center" py={10}>
          <ShoppingBag sx={{ fontSize: 80, color: '#ddd', mb: 2 }} />
          <Typography variant="h5" fontWeight={600} mb={1}>No orders yet</Typography>
          <Typography color="text.secondary" mb={4}>Start shopping and your orders will appear here.</Typography>
          <Button variant="contained" onClick={() => navigate('/products')}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
            Shop Now
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Items</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Payment</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{order.orderItems?.length} item(s)</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700} color="#e94560">
                      ${order.totalPrice?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.isPaid ? 'Paid' : 'Unpaid'}
                      color={order.isPaid ? 'success' : 'default'}
                      size="small" variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color={statusColors[order.orderStatus] || 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small" variant="outlined" startIcon={<Visibility />}
                      onClick={() => navigate(`/orders/${order._id}`)}
                      sx={{ borderColor: '#1a1a2e', color: '#1a1a2e' }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyOrdersPage;
