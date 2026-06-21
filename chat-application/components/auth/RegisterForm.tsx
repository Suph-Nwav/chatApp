'use client';

import { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (password.length < 6) {
      setValidationError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    await register({ email, username, password });
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
        Tạo tài khoản
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#b9bbbe',
          textAlign: 'center',
          mb: 3,
        }}
      >
        Tham gia Java Builder Chat ngay hôm nay!
      </Typography>

      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || validationError}
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
        label="Tên người dùng"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
                <Person sx={{ color: '#b9bbbe', fontSize: 20 }} />
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

      <TextField
        fullWidth
        label="Xác nhận mật khẩu"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: '#b9bbbe' }}
                >
                  {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
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
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: '#b9bbbe' }}>
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            style={{
              color: '#00b0f4',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Đăng nhập
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
