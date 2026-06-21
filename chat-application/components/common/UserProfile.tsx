'use client';

import { Box, Avatar, Typography, Menu, MenuItem } from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfile() {
  const { user } = useUserStore();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  if (!user) return null;

  return (
    <Box>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          cursor: 'pointer',
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#5865f2',
            width: 40,
            height: 40,
          }}
        >
          {user.username?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            {user.username || 'User'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#b9bbbe',
              fontSize: '0.75rem',
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#18191c',
              color: '#fff',
              minWidth: 200,
            },
          },
        }}
      >
        <MenuItem onClick={handleClose}>
          <Settings sx={{ mr: 1, fontSize: 20 }} />
          Cài đặt
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: '#ed4245' }}>
          <Logout sx={{ mr: 1, fontSize: 20 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
}
