import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, IconButton,
  Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, Select, MenuItem, Tooltip, Pagination,
} from '@mui/material';
import { Delete, AdminPanelSettings, Person } from '@mui/icons-material';
import AdminLayout from '../../components/admin/AdminLayout';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/users?page=${page}&limit=10`);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch { toast.error('Failed to fetch users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(currentPage); }, [currentPage]);

  const handleRoleChange = async (userId, role) => {
    try {
      await API.put(`/users/${userId}`, { role });
      toast.success('User role updated');
      fetchUsers(currentPage);
    } catch { toast.error('Failed to update role'); }
  };

  const handleStatusToggle = async (user) => {
    try {
      await API.put(`/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      fetchUsers(currentPage);
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/users/${deleteDialog.user._id}`);
      toast.success('User deleted');
      setDeleteDialog({ open: false, user: null });
      fetchUsers(currentPage);
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <AdminLayout title="Users">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>Manage Users</Typography>
        <Typography variant="body2" color="text.secondary">{users.length} users on this page</Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Joined</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: user.role === 'admin' ? '#e94560' : '#1a1a2e', width: 36, height: 36, fontSize: 14 }}>
                      {user.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.phone || '—'}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      sx={{ fontSize: 13, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }}>
                      <MenuItem value="user"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Person fontSize="small" />User</Box></MenuItem>
                      <MenuItem value="admin"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AdminPanelSettings fontSize="small" />Admin</Box></MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? 'Active' : 'Inactive'}
                    color={user.isActive ? 'success' : 'default'}
                    size="small" variant="outlined"
                    onClick={() => handleStatusToggle(user)}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Delete user">
                    <IconButton size="small" color="error"
                      onClick={() => setDeleteDialog({ open: true, user })}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && !loading && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 5, color: 'text.secondary' }}>No users found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={totalPages} page={currentPage} onChange={(_, v) => setCurrentPage(v)} />
        </Box>
      )}

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{deleteDialog.user?.name}</strong>? This is permanent.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;
