'use client';

import { Button, CircularProgress } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useUser } from '@/hooks/useUser';

export default function RefreshUserButton() {
  const { myInfo, loading } = useUser();

  const handleRefresh = async () => {
    try {
      await myInfo();
    } catch (error) {
      console.error('Failed to refresh user info:', error);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
      sx={{
        color: '#b9bbbe',
        textTransform: 'none',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      {loading ? 'Đang tải...' : 'Làm mới thông tin'}
    </Button>
  );
}
