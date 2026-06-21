import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { LoginRequest, RegisterRequest } from '@/types';
import { useUserStore } from '@/store/useUserStore';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser, clearUser } = useUserStore();

  const login = async (data: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(data);
      
      if (response.data) {
        const { accessToken, refreshToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const userInfoResponse = await authService.myInfo();
        if (userInfoResponse.data) {
          setUser(userInfoResponse.data);
        }
        
        router.push('/');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.register(data);
      router.push('/login');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đăng ký thất bại';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    clearUser();
    router.push('/login');
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
  };
};
