import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Paper, Typography, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress,
} from '@mui/material';
import {
  People, Inventory, ShoppingBag, AttachMoney,
  TrendingUp, Warning,
} from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import API from '../../utils/axios';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="body2" color="text.secondary" mb={0.5}>{title}</Typography>
        <Typography variant="h4" fontWeight={800}>{value}</Typography>
        {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
      </Box>
      <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1.5 }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
      </Box>
    </Box>
  </Paper>
);

const statusColors = { pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error' };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout title="Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Revenue" value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
            icon={<AttachMoney />} color="#4caf50" subtitle="From paid orders" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Orders" value={stats?.totalOrders || 0}
            icon={<ShoppingBag />} color="#2196f3" subtitle="All time orders" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Products" value={stats?.totalProducts || 0}
            icon={<Inventory />} color="#ff9800" subtitle="Active products" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Users" value={stats?.totalUsers || 0}
            icon={<People />} color="#e94560" subtitle="Registered users" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent orders */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={700}>Recent Orders</Typography>
              <Button size="small" onClick={() => navigate('/admin/orders')} sx={{ color: '#e94560' }}>View All</Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                  <TableRow>
                    <TableCell><strong>Order ID</strong></TableCell>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats?.recentOrders?.map((order) => (
                    <TableRow key={order._id} hover sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/orders`)}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </TableCell>
                      <TableCell>{order.user?.name || 'Guest'}</TableCell>
                      <TableCell><strong>${order.totalPrice?.toFixed(2)}</strong></TableCell>
                      <TableCell>
                        <Chip label={order.orderStatus} color={statusColors[order.orderStatus] || 'default'}
                          size="small" sx={{ textTransform: 'capitalize' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>No orders yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right column */}
        <Grid item xs={12} lg={4}>
          {/* Orders by status */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp color="action" fontSize="small" /> Orders by Status
            </Typography>
            {stats?.ordersByStatus?.map((s) => (
              <Box key={s._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Chip label={s._id} color={statusColors[s._id] || 'default'} size="small" sx={{ textTransform: 'capitalize' }} />
                <Typography variant="subtitle2" fontWeight={700}>{s.count}</Typography>
              </Box>
            ))}
            {(!stats?.ordersByStatus || stats.ordersByStatus.length === 0) && (
              <Typography variant="body2" color="text.secondary">No orders yet</Typography>
            )}
          </Paper>

          {/* Low stock warning */}
          {stats?.lowStockProducts?.length > 0 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #ff9800', borderRadius: 2, bgcolor: '#fff8e1' }}>
              <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#e65100' }}>
                <Warning color="warning" fontSize="small" /> Low Stock Alert
              </Typography>
              {stats.lowStockProducts.map((p) => (
                <Box key={p._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" noWrap sx={{ maxWidth: '75%' }}>{p.name}</Typography>
                  <Chip label={`${p.stock} left`} color="warning" size="small" />
                </Box>
              ))}
              <Button size="small" onClick={() => navigate('/admin/products')} sx={{ mt: 1, color: '#e65100' }}>
                Manage Products →
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboard;
