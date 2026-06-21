import { Box, Typography } from '@mui/material';
import { Chat } from '@mui/icons-material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  const sizes = {
    small: { icon: 32, text: '1rem' },
    medium: { icon: 48, text: '1.5rem' },
    large: { icon: 64, text: '2rem' },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {/* Logo Icon */}
      <Box
        sx={{
          width: sizes[size].icon,
          height: sizes[size].icon,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #5865f2 0%, #7289da 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(88, 101, 242, 0.4)',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Chat
          sx={{
            color: '#fff',
            fontSize: sizes[size].icon * 0.6,
          }}
        />
      </Box>

      {/* Logo Text */}
      {showText && (
        <Box>
          <Typography
            sx={{
              color: '#fff',
              fontSize: sizes[size].text,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
            }}
          >
            Chat App
          </Typography>
          <Typography
            sx={{
              color: '#b9bbbe',
              fontSize: `calc(${sizes[size].text} * 0.6)`,
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            CHAT
          </Typography>
        </Box>
      )}
    </Box>
  );
}
