'use client';

import { Box, Typography } from '@mui/material';
import { ChatBubbleOutline, Forum, Send } from '@mui/icons-material';

interface ChatPlaceholderProps {
  variant?: 'no-conversation' | 'no-messages';
}

export default function ChatPlaceholder({ variant = 'no-conversation' }: ChatPlaceholderProps) {
  if (variant === 'no-messages') {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 3,
          px: 4,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(88, 101, 242, 0.1)',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  transform: 'translate(-50%, -50%) scale(1)',
                  opacity: 0.5,
                },
                '50%': {
                  transform: 'translate(-50%, -50%) scale(1.2)',
                  opacity: 0.3,
                },
              },
            }}
          />
          <ChatBubbleOutline
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 48,
              color: '#5865f2',
            }}
          />
        </Box>

        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Typography
            sx={{
              color: '#fff',
              fontSize: '1.25rem',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Chưa có tin nhắn nào
          </Typography>
          <Typography
            sx={{
              color: '#b9bbbe',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
            }}
          >
            Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        px: 4,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 160,
          height: 160,
        }}
      >
        {/* Animated circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(88, 101, 242, 0.1)',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 0.5,
              },
              '50%': {
                transform: 'translate(-50%, -50%) scale(1.3)',
                opacity: 0.2,
              },
            },
          }}
        />

        {/* Icons */}
        <Forum
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 64,
            color: '#5865f2',
          }}
        />
        
        <Send
          sx={{
            position: 'absolute',
            top: '20%',
            right: '15%',
            fontSize: 28,
            color: '#43b581',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            },
          }}
        />
      </Box>

      <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          Chọn một cuộc trò chuyện để bắt đầu
        </Typography>
        <Typography
          sx={{
            color: '#b9bbbe',
            fontSize: '1rem',
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          Chọn một cuộc trò chuyện từ danh sách bên trái hoặc tạo cuộc trò chuyện mới
          bằng cách nhấn vào nút <Box component="span" sx={{ color: '#5865f2', fontWeight: 600 }}>+</Box>
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(88, 101, 242, 0.1)',
            }}
          >
            <ChatBubbleOutline sx={{ fontSize: 20, color: '#5865f2' }} />
            <Typography sx={{ color: '#b9bbbe', fontSize: '0.875rem' }}>
              Nhắn tin riêng tư
            </Typography>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(67, 181, 129, 0.1)',
            }}
          >
            <Forum sx={{ fontSize: 20, color: '#43b581' }} />
            <Typography sx={{ color: '#b9bbbe', fontSize: '0.875rem' }}>
              Trò chuyện nhóm
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
