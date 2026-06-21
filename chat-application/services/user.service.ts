import axiosClient from '@/api/axioClient';
import { ApiResponse, PageResponse, UserDetailResponse } from '@/types';

export const userService = {
  searchUsers: async (keyword: string, page = 1, size = 10) => {
    return axiosClient.get<ApiResponse<PageResponse<UserDetailResponse>>>(
      '/api/v1/users/search',
      { params: { keyword, page, size } }
    );
  },
};
