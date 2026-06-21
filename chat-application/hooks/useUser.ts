import { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { authService } from '@/services/auth.service';

export const useUser = () => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.myInfo();
      if (response.data) {
        setUser({
          userId: response.data.userId,
          email: response.data.email,
          username: response.data.username,
        });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải thông tin user';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    myInfo,
    loading,
    error,
  };
};
