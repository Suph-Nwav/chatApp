'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import { userService } from '@/services/user.service';
import { conversationService } from '@/services/conversation.service';
import { UserDetailResponse, ConversationType } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import UserSearchList from './UserSearchList';

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string) => void;
}

export default function NewConversationDialog({
  open,
  onClose,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [keyword, setKeyword] = useState('');
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserDetailResponse[]>([]);
  const [groupName, setGroupName] = useState('');

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedKeyword.trim()) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const response = await userService.searchUsers(debouncedKeyword, 1, 10);
        setUsers(response.data.data.content);
      } catch (error) {
        console.error('Failed to search users:', error);
      } finally {
        setLoading(false);
      }
    };

    searchUsers();
  }, [debouncedKeyword]);

  const handleToggleUser = (user: UserDetailResponse) => {
    setSelectedUsers((prevSelected) => {
      const isSelected = prevSelected.some((u) => u.userId === user.userId);
      if (isSelected) {
        return prevSelected.filter((u) => u.userId !== user.userId);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setCreating(true);
      const isGroup = selectedUsers.length > 1;
      const response = await conversationService.createConversation({
        participantIds: selectedUsers.map((u) => u.userId),
        conversationType: isGroup ? ConversationType.GROUP : ConversationType.PRIVATE,
        name: isGroup ? groupName : undefined,
      });

      onConversationCreated(response.data.id);
      handleClose();
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setKeyword('');
    setUsers([]);
    setSelectedUsers([]);
    setGroupName('');
    onClose();
  };

  const isGroup = selectedUsers.length > 1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            backgroundColor: '#36393f',
            backgroundImage: 'none',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#fff',
          pb: 1,
          fontWeight: 600,
        }}
      >
        {isGroup ? 'Tạo nhóm mới' : 'Tìm kiếm người dùng'}
        <IconButton onClick={handleClose} size="small" sx={{ color: '#b9bbbe' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {selectedUsers.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedUsers.map((user) => (
              <Chip
                key={user.userId}
                label={user.username}
                onDelete={() => handleToggleUser(user)}
                sx={{
                  backgroundColor: '#5865f2',
                  color: '#fff',
                  '& .MuiChip-deleteIcon': {
                    color: '#fff',
                    '&:hover': {
                      color: '#ddd',
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}

        {isGroup && (
          <TextField
            fullWidth
            placeholder="Tên nhóm..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#202225',
                color: '#fff',
                '& fieldset': {
                  borderColor: '#202225',
                },
                '&:hover fieldset': {
                  borderColor: '#40444b',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#5865f2',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#72767d',
                opacity: 1,
              },
            }}
          />
        )}

        <TextField
          fullWidth
          placeholder="Tìm theo email hoặc tên người dùng..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          autoFocus
          InputProps={{
            startAdornment: <Search sx={{ color: '#72767d', mr: 1 }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#202225',
              color: '#fff',
              '& fieldset': {
                borderColor: '#202225',
              },
              '&:hover fieldset': {
                borderColor: '#40444b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#5865f2',
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#72767d',
              opacity: 1,
            },
          }}
        />

        <Box sx={{ mt: 2, minHeight: 200, maxHeight: 400, overflowY: 'auto' }}>
          <UserSearchList
            users={users}
            loading={loading}
            keyword={keyword}
            creating={creating}
            onSelectUser={handleToggleUser}
            selectedUsers={selectedUsers}
          />
        </Box>

        {selectedUsers.length > 0 && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreateConversation}
            disabled={creating || (isGroup && !groupName.trim())}
            sx={{
              mt: 2,
              backgroundColor: '#5865f2',
              '&:hover': {
                backgroundColor: '#4752c4',
              },
            }}
          >
            {creating ? 'Đang tạo...' : isGroup ? 'Tạo nhóm' : 'Tạo cuộc trò chuyện'}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
