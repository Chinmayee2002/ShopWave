import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Grid, TextField, Button, Paper, Typography,
  FormControlLabel, Switch, MenuItem, Select,
  FormControl, InputLabel, Chip, Alert,
} from '@mui/material';
import { ArrowBack, Save, CloudUpload } from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchProductById, createProduct, updateProduct } from '../../store/slices/productSlice';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

const AdminProductForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.products);
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '',
    category: '', stock: '', brand: '', isFeatured: false,
    isActive: true, tags: '', images: [],
  });

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
    if (isEdit) dispatch(fetchProductById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && product && product._id === id) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category?._id || '',
        stock: product.stock || '',
        brand: product.brand || '',
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        tags: product.tags?.join(', ') || '',
        images: product.images || [],
      });
    }
  }, [product, id, isEdit]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    setUploading(true);
    try {
      const response = await API.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((f) => ({ ...f, images: [...f.images, response.data.imageUrl] }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.category || formData.stock === '') {
      toast.error('Please fill all required fields'); return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      stock: Number(formData.stock),
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, productData: payload })).unwrap();
        toast.success('Product updated!');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err || 'Failed to save product');
    }
  };

  const imageUrl = (img) =>
    img?.startsWith('http') ? img : img ? `http://localhost:5000${img}` : null;

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/products')} sx={{ mb: 3, color: 'text.secondary' }}>
        Back to Products
      </Button>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main info */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>Product Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Product Name *" name="name" value={formData.name} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Description *" name="description"
                    value={formData.description} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Price ($) *" name="price" type="number"
                    value={formData.price} onChange={handleChange} required inputProps={{ min: 0, step: 0.01 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Original Price ($)" name="originalPrice" type="number"
                    value={formData.originalPrice} onChange={handleChange} inputProps={{ min: 0, step: 0.01 }}
                    helperText="Used to show discount" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Stock *" name="stock" type="number"
                    value={formData.stock} onChange={handleChange} required inputProps={{ min: 0 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Tags (comma separated)" name="tags" value={formData.tags}
                    onChange={handleChange} helperText="e.g. electronics, gadget, mobile" />
                </Grid>
              </Grid>
            </Paper>

            {/* Images */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={2}>Product Images</Typography>
              <Button variant="outlined" component="label" startIcon={<CloudUpload />} disabled={uploading}
                sx={{ mb: 2 }}>
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                {formData.images.map((img, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <Box component="img" src={imageUrl(img) || img} alt={`product-${i}`}
                      sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2, border: '1px solid #e0e0e0' }} />
                    <Chip label="✕" size="small" onClick={() => handleRemoveImage(i)}
                      sx={{ position: 'absolute', top: -8, right: -8, cursor: 'pointer', bgcolor: '#e94560', color: 'white', minWidth: 0, height: 22, '& .MuiChip-label': { px: 1 } }} />
                  </Box>
                ))}
                {formData.images.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No images uploaded yet. Add at least one image.
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                You can also paste an image URL in the images array directly.
              </Typography>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>Category & Status</Typography>
              <FormControl fullWidth sx={{ mb: 2 }} required>
                <InputLabel>Category *</InputLabel>
                <Select name="category" value={formData.category} label="Category *"
                  onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}>
                  {categories.map((cat) => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch checked={formData.isFeatured} onChange={(e) => setFormData((f) => ({ ...f, isFeatured: e.target.checked }))} />}
                label="Featured Product"
                sx={{ display: 'flex', mb: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={formData.isActive} onChange={(e) => setFormData((f) => ({ ...f, isActive: e.target.checked }))} />}
                label="Active (visible to customers)"
                sx={{ display: 'flex' }}
              />
            </Paper>

            <Button type="submit" variant="contained" size="large" fullWidth startIcon={<Save />}
              disabled={loading}
              sx={{ py: 1.5, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' }, fontSize: 16 }}>
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AdminProductForm;
