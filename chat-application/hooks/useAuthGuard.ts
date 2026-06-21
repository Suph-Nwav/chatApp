'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export const useAuthGuard = () => {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token || !user) {
      router.push('/login');
    }
  }, [user, router]);

  return { isAuthenticated: !!user };
};
