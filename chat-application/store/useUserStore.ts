import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserDetailResponse } from '@/types';

interface UserState {
  user: UserDetailResponse | null;
  
  setUser: (user: UserDetailResponse) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
