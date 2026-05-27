import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Grid, Box, Typography, TextField, Button,
  Paper, Avatar, Divider, Alert, Tab, Tabs,
} from '@mui/material';
import { Person, Lock, LocationOn } from '@mui/icons-material';
import { updateProfile } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const [tab, setTab] = useState(0);
  const [profileData, setProfileData] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    phone: userInfo?.phone || '',
  });
  const [addressData, setAddressData] = useState({
    street: userInfo?.address?.street || '',
    city: userInfo?.address?.city || '',
    state: userInfo?.address?.state || '',
    zipCode: userInfo?.address?.zipCode || '',
    country: userInfo?.address?.country || '',
  });
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({ address: addressData })).unwrap();
      toast.success('Address updated successfully!');
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await dispatch(updateProfile({ password: passwordData.password })).unwrap();
      toast.success('Password updated successfully!');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>My Profile</Typography>

      <Grid container spacing={4}>
        {/* Profile sidebar */}
        <Grid item xs={12} md={3}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2, textAlign: 'center' }}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: '#1a1a2e', fontSize: 36, mx: 'auto', mb: 2 }}>
              {userInfo?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>{userInfo?.name}</Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>{userInfo?.email}</Typography>
            <Typography variant="caption" sx={{
              bgcolor: userInfo?.role === 'admin' ? '#e94560' : '#1a1a2e',
              color: 'white', px: 2, py: 0.5, borderRadius: 10, textTransform: 'capitalize'
            }}>
              {userInfo?.role}
            </Typography>
          </Paper>
        </Grid>

        {/* Edit forms */}
        <Grid item xs={12} md={9}>
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
              <Tab icon={<Person fontSize="small" />} iconPosition="start" label="Personal Info" />
              <Tab icon={<LocationOn fontSize="small" />} iconPosition="start" label="Address" />
              <Tab icon={<Lock fontSize="small" />} iconPosition="start" label="Password" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {/* Personal Info */}
              {tab === 0 && (
                <Box component="form" onSubmit={handleProfileUpdate}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Full Name" value={profileData.name}
                        onChange={(e) => setProfileData((d) => ({ ...d, name: e.target.value }))} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email Address" type="email" value={profileData.email}
                        onChange={(e) => setProfileData((d) => ({ ...d, email: e.target.value }))} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Phone Number" value={profileData.phone}
                        onChange={(e) => setProfileData((d) => ({ ...d, phone: e.target.value }))} />
                    </Grid>
                  </Grid>
                  <Button type="submit" variant="contained" sx={{ mt: 3, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}

              {/* Address */}
              {tab === 1 && (
                <Box component="form" onSubmit={handleAddressUpdate}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Street Address" value={addressData.street}
                        onChange={(e) => setAddressData((d) => ({ ...d, street: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="City" value={addressData.city}
                        onChange={(e) => setAddressData((d) => ({ ...d, city: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="State" value={addressData.state}
                        onChange={(e) => setAddressData((d) => ({ ...d, state: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="ZIP Code" value={addressData.zipCode}
                        onChange={(e) => setAddressData((d) => ({ ...d, zipCode: e.target.value }))} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Country" value={addressData.country}
                        onChange={(e) => setAddressData((d) => ({ ...d, country: e.target.value }))} />
                    </Grid>
                  </Grid>
                  <Button type="submit" variant="contained" sx={{ mt: 3, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Address'}
                  </Button>
                </Box>
              )}

              {/* Password */}
              {tab === 2 && (
                <Box component="form" onSubmit={handlePasswordUpdate}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="New Password" type="password"
                        value={passwordData.password} helperText="Minimum 6 characters"
                        onChange={(e) => setPasswordData((d) => ({ ...d, password: e.target.value }))} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Confirm Password" type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((d) => ({ ...d, confirmPassword: e.target.value }))} required />
                    </Grid>
                  </Grid>
                  <Button type="submit" variant="contained" sx={{ mt: 3, bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#e94560' } }} disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
