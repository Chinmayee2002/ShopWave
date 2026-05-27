import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Box, TextField, Button, Typography,
  Paper, InputAdornment, IconButton, Alert,
} from '@mui/material';
import { Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser, clearError } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userInfo) navigate('/');
    return () => dispatch(clearError());
  }, [userInfo, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await dispatch(registerUser({ name: formData.name, email: formData.email, password: formData.password }));
    if (result.meta.requestStatus === 'fulfilled') toast.success('Account created successfully!');
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight={800} color="#1a1a2e">Create Account</Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>Join ShopWave today — it's free!</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange}
              margin="normal" required
              InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
            />
            <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange}
              margin="normal" required
              InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'}
              value={formData.password} onChange={handleChange} margin="normal" required
              helperText="Minimum 6 characters"
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
            <TextField
              fullWidth label="Confirm Password" name="confirmPassword" type="password"
              value={formData.confirmPassword} onChange={handleChange} margin="normal" required
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment> }}
            />

            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ mt: 3, mb: 2, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' }, py: 1.5, fontSize: 16 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          <Typography textAlign="center" variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
