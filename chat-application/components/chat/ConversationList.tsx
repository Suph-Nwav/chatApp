'use client';

import { Box, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, CircularProgress } from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';
import { ConversationDetailResponse, ConversationType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState, useEffect } from 'react';

interface ConversationListProps {
  conversations: ConversationDetailResponse[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  loading = false,
}: ConversationListProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getConversationName = (conv: ConversationDetailResponse) => {
    if (conv.name) return conv.name;
    return conv.participantInfo?.map(p => p.username).join(', ') || 'Conversation';
  };

  const formatTime = (timeString: string) => {
    if (!isMounted) return '';
    return formatDistanceToNow(new Date(timeString), {
      addSuffix: false,
      locale: vi,
    }).replace('khoảng ', '');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#5865f2' }} />
      </Box>
    );
  }

  return (
    <List sx={{ p: 0 }}>
      {conversations.map((conv) => (
        <ListItemButton
          key={conv.id}
          selected={selectedId === conv.id}
          onClick={() => onSelect(conv.id)}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            '&.Mui-selected': {
              backgroundColor: '#404249',
              '&:hover': {
                backgroundColor: '#404249',
              },
            },
            '&:hover': {
              backgroundColor: '#35373c',
            },
          }}
        >
          <ListItemAvatar sx={{ minWidth: 48 }}>
            <Avatar
              src={conv.conversationAvatar || undefined}
              sx={{
                bgcolor: '#5865f2',
                width: 40,
                height: 40,
                fontSize: '1rem',
              }}
            >
              {getConversationName(conv)[0]?.toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ my: 0 }}
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden', mr: 1 }}>
                  {conv.conversationType === ConversationType.GROUP && (
                    <GroupIcon sx={{ color: '#b9bbbe', fontSize: '1.1rem', mr: 0.5, flexShrink: 0 }} />
                  )}
                  <Typography
                    component="span"
                    sx={{
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2,
                    }}
                  >
                    {getConversationName(conv)}
                  </Typography>
                </Box>
                {conv.lastMessageTime && (
                  <Typography
                    component="span"
                    sx={{
                      color: '#72767d',
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      flexShrink: 0,
                    }}
                  >
                    {formatTime(conv.lastMessageTime)}
                  </Typography>
                )}
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  component="span"
                  sx={{
                    color: '#b9bbbe',
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {conv.lastMessageContent || 'Chưa có tin nhắn'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: conv.isOnline ? '#23a55a' : '#80848e',
                    }}
                  />
                  <Typography
                    component="span"
                    sx={{
                      color: conv.isOnline ? '#23a55a' : '#80848e',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {conv.isOnline ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              </Box>
            }
          />
        </ListItemButton>
      ))}
    </List>
  );
}
