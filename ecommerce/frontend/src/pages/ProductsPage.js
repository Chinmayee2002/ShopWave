import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, FormControl, InputLabel, Select,
  MenuItem, Slider, Button, Divider, Pagination, Chip, Paper,
  Drawer, IconButton, useMediaQuery, useTheme, TextField, InputAdornment,
} from '@mui/material';
import { FilterList, Close, Search } from '@mui/icons-material';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import Loader from '../components/common/Loader';
import API from '../utils/axios';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading, totalPages, total } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'latest',
    minPrice: '',
    maxPrice: '',
    page: 1,
  });
  const [priceRange, setPriceRange] = useState([0, 2000]);

  useEffect(() => {
    API.get('/categories').then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const loadProducts = useCallback(() => {
    const params = { ...filters, minPrice: priceRange[0] > 0 ? priceRange[0] : '', maxPrice: priceRange[1] < 2000 ? priceRange[1] : '' };
    // Remove empty params
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    dispatch(fetchProducts(params));
  }, [dispatch, filters, priceRange]);

  useEffect(() => { loadProducts(); }, [filters.page, filters.category, filters.sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1 }));
    loadProducts();
  };

  const handleFilterApply = () => {
    setFilters((f) => ({ ...f, page: 1 }));
    loadProducts();
    setDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', category: '', sort: 'latest', minPrice: '', maxPrice: '', page: 1 });
    setPriceRange([0, 2000]);
    setSearchParams({});
  };

  const activeFiltersCount = [filters.category, filters.search, priceRange[0] > 0 || priceRange[1] < 2000].filter(Boolean).length;

  const FilterContent = () => (
    <Box sx={{ p: isMobile ? 3 : 0 }}>
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" fontWeight={700}>Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
        </Box>
      )}

      {/* Category filter */}
      <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Category</Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))} displayEmpty>
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>)}
        </Select>
      </FormControl>

      <Divider sx={{ mb: 3 }} />

      {/* Price range */}
      <Typography variant="subtitle2" fontWeight={700} mb={1}>Price Range</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>${priceRange[0]} – ${priceRange[1]}</Typography>
      <Slider
        value={priceRange} onChange={(_, val) => setPriceRange(val)}
        min={0} max={2000} step={10} valueLabelDisplay="auto"
        sx={{ color: '#e94560', mb: 3 }}
      />

      <Divider sx={{ mb: 3 }} />

      <Button fullWidth variant="contained" onClick={handleFilterApply}
        sx={{ mb: 1, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }}>
        Apply Filters
      </Button>
      {activeFiltersCount > 0 && (
        <Button fullWidth variant="outlined" color="error" onClick={handleClearFilters}>
          Clear All
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>All Products</Typography>
          <Typography variant="body2" color="text.secondary">{total} products found</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex' }}>
            <TextField
              size="small" placeholder="Search products..."
              value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><Button type="submit" size="small" sx={{ minWidth: 0 }}>Go</Button></InputAdornment>,
              }}
              sx={{ width: 220 }}
            />
          </Box>

          {/* Sort */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={filters.sort} label="Sort By" onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}>
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Top Rated</MenuItem>
            </Select>
          </FormControl>

          {/* Mobile filter button */}
          {isMobile && (
            <Button variant="outlined" startIcon={<FilterList />} onClick={() => setDrawerOpen(true)}>
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          )}
        </Box>
      </Box>

      {/* Active filter chips */}
      {(filters.category || filters.search) && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {filters.search && <Chip label={`Search: "${filters.search}"`} onDelete={() => setFilters((f) => ({ ...f, search: '' }))} size="small" />}
          {filters.category && <Chip label={`Category: ${categories.find((c) => c._id === filters.category)?.name}`} onDelete={() => setFilters((f) => ({ ...f, category: '' }))} size="small" />}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Desktop sidebar */}
        {!isMobile && (
          <Grid item md={2.5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', position: 'sticky', top: 80 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>
                Filters {activeFiltersCount > 0 && <Chip label={activeFiltersCount} size="small" color="error" sx={{ ml: 1 }} />}
              </Typography>
              <FilterContent />
            </Paper>
          </Grid>
        )}

        {/* Products grid */}
        <Grid item xs={12} md={9.5}>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Typography variant="h5" color="text.secondary" mb={2}>No products found</Typography>
              <Button variant="contained" onClick={handleClearFilters} sx={{ bgcolor: '#e94560' }}>Clear Filters</Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} lg={4} xl={3} key={product._id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Pagination
                    count={totalPages} page={filters.page}
                    onChange={(_, val) => { setFilters((f) => ({ ...f, page: val })); window.scrollTo(0, 0); }}
                    color="primary" size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile filter drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }}><FilterContent /></Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage;
