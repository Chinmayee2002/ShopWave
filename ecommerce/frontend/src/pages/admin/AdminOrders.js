import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, Select, MenuItem,
  FormControl, Pagination, TextField, InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const statusColors = { pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error' };
const allStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, totalPages } = useSelector((state) => state.orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = { page: currentPage, limit: 10 };
    if (statusFilter) params.status = statusFilter;
    dispatch(fetchAllOrders(params));
  }, [dispatch, currentPage, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, orderStatus: newStatus })).unwrap();
      toast.success(`Order status updated to "${newStatus}"`);
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  return (
    <AdminLayout title="Orders">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" fontWeight={600}>Manage Orders</Typography>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} displayEmpty>
            <MenuItem value="">All Statuses</MenuItem>
            {allStatuses.map((s) => <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {loading ? <Loader /> : (
        <>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Items</strong></TableCell>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell><strong>Payment</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{order.user?.name || 'Unknown'}</Typography>
                      <Typography variant="caption" color="text.secondary">{order.user?.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.orderItems?.length} item(s)</TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="#e94560">${order.totalPrice?.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.isPaid ? 'Paid' : 'Unpaid'}
                        color={order.isPaid ? 'success' : 'default'}
                        size="small" variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 130 }}>
                        <Select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          sx={{
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                            fontSize: 13,
                          }}
                        >
                          {allStatuses.map((s) => (
                            <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} />
            </Box>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
