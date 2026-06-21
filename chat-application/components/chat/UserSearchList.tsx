'use client';

import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Checkbox,
} from '@mui/material';
import { UserDetailResponse } from '@/types';

interface UserSearchListProps {
  users: UserDetailResponse[];
  loading: boolean;
  keyword: string;
  creating: boolean;
  onSelectUser: (user: UserDetailResponse) => void;
  selectedUsers: UserDetailResponse[];
}

export default function UserSearchList({
  users,
  loading,
  keyword,
  creating,
  onSelectUser,
  selectedUsers,
}: UserSearchListProps) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#5865f2' }} size={32} />
      </Box>
    );
  }

  if (users.length > 0) {
    return (
      <List sx={{ p: 0 }}>
        {users.map((user) => {
          const isSelected = selectedUsers.some((u) => u.userId === user.userId);
          return (
            <ListItemButton
              key={user.userId}
              onClick={() => onSelectUser(user)}
              disabled={creating}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: '#40444b',
                },
              }}
            >
              <Checkbox
                checked={isSelected}
                sx={{
                  color: '#72767d',
                  '&.Mui-checked': {
                    color: '#5865f2',
                  },
                }}
              />
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: '#5865f2',
                    width: 40,
                    height: 40,
                  }}
                >
                  {user.username[0]?.toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                    {user.username}
                  </Typography>
                }
                secondary={
                  <Typography sx={{ color: '#b9bbbe', fontSize: '0.875rem' }}>
                    {user.email}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    );
  }

  if (keyword.trim()) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
          color: '#72767d',
        }}
      >
        <Typography>Không tìm thấy người dùng</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
        color: '#72767d',
      }}
    >
      <Typography>Nhập email hoặc tên để tìm kiếm</Typography>
    </Box>
  );
}
