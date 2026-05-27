import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, IconButton, Chip, Avatar,
  TextField, InputAdornment, Dialog, DialogTitle, DialogContent,
  DialogActions, Pagination, Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, totalPages, page, total } = useSelector((state) => state.products);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: 10, search }));
  }, [dispatch, currentPage, search]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteProduct(productToDelete._id)).unwrap();
      toast.success('Product deleted');
      setDeleteDialogOpen(false);
      dispatch(fetchProducts({ page: currentPage, limit: 10 }));
    } catch (err) {
      toast.error(err || 'Failed to delete');
    }
  };

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `http://localhost:5000${img}` : null;

  return (
    <AdminLayout title="Products">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>All Products</Typography>
          <Typography variant="body2" color="text.secondary">{total} products total</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search products..."
            value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            sx={{ width: 220 }}
          />
          <Button variant="contained" startIcon={<Add />}
            onClick={() => navigate('/admin/products/new')}
            sx={{ bgcolor: '#e94560', '&:hover': { bgcolor: '#c73652' } }}>
            Add Product
          </Button>
        </Box>
      </Box>

      {loading ? <Loader /> : (
        <>
          <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                  <TableCell><strong>Stock</strong></TableCell>
                  <TableCell><strong>Featured</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={imageUrl(product.images?.[0])}
                          variant="rounded"
                          sx={{ width: 44, height: 44, bgcolor: '#f0f0f0' }}
                        >
                          {product.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{product.brand}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={product.category?.name || 'N/A'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700} color="#e94560">${product.price?.toFixed(2)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.stock}
                        color={product.stock === 0 ? 'error' : product.stock <= 5 ? 'warning' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {product.isFeatured
                        ? <Chip label="Featured" color="primary" size="small" />
                        : <Chip label="No" size="small" variant="outlined" />}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => navigate(`/admin/products/edit/${product._id}`)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(product)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      No products found
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

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
