import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Box, TextField, Button, Typography,
  Paper, InputAdornment, IconButton, Divider, Alert,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (userInfo) navigate(from, { replace: true });
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch, from]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { toast.error('Please fill all fields'); return; }
    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Welcome back!');
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={800} color="#1a1a2e">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Sign in to your ShopWave account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email Address" name="email" type="email"
              value={formData.email} onChange={handleChange}
              margin="normal" required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
              }}
            />
            <TextField
              fullWidth label="Password" name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange}
              margin="normal" required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ mt: 3, mb: 2, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' }, py: 1.5, fontSize: 16 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}><Typography variant="body2" color="text.secondary">OR</Typography></Divider>

          {/* Demo credentials */}
          <Box sx={{ bgcolor: '#f8f9fa', borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="body2" fontWeight={600} mb={1} color="text.secondary">Demo Credentials:</Typography>
            <Typography variant="body2" color="text.secondary">👤 User: john@example.com / admin123</Typography>
            <Typography variant="body2" color="text.secondary">🔑 Admin: admin@shopwave.com / admin123</Typography>
          </Box>

          <Typography textAlign="center" variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
