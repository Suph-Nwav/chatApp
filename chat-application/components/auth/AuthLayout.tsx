import { Box, Container } from '@mui/material';
import { ReactNode } from 'react';
import Logo from '@/components/common/Logo';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
      }}
    >
      {/* Logo ở góc trái trên */}
      <Box
        sx={{
          position: 'absolute',
          top: 32,
          left: 32,
        }}
      >
        <Logo size="medium" showText={true} />
      </Box>

      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#36393f',
            borderRadius: 2,
            padding: 4,
            boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}
