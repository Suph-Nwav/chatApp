'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          fontWeight: 700,
          textAlign: 'center',
          mb: 1,
        }}
      >
        Chào mừng trở lại!
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#b9bbbe',
          textAlign: 'center',
          mb: 3,
        }}
      >
        Chúng tôi rất vui được gặp lại bạn!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#202225',
            color: '#fff',
            '& fieldset': { borderColor: '#202225' },
            '&:hover fieldset': { borderColor: '#4752c4' },
            '&.Mui-focused fieldset': { borderColor: '#5865f2' },
          },
          '& .MuiInputLabel-root': { color: '#b9bbbe' },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #202225 inset',
            WebkitTextFillColor: '#fff',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: '#b9bbbe', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        fullWidth
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#202225',
            color: '#fff',
            '& fieldset': { borderColor: '#202225' },
            '&:hover fieldset': { borderColor: '#4752c4' },
            '&.Mui-focused fieldset': { borderColor: '#5865f2' },
          },
          '& .MuiInputLabel-root': { color: '#b9bbbe' },
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #202225 inset',
            WebkitTextFillColor: '#fff',
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Lock sx={{ color: '#b9bbbe', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: '#b9bbbe' }}
                >
                  {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          backgroundColor: '#5865f2',
          color: '#fff',
          py: 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#4752c4',
          },
          '&:disabled': {
            backgroundColor: '#4752c4',
            opacity: 0.5,
          },
        }}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#b9bbbe' }}>
          Bạn chưa có tài khoản?{' '}
          <Link
            href="/register"
            style={{
              color: '#00b0f4',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Đăng ký
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
