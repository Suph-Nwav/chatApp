import axiosClient from '@/api/axioClient';
import { API_ENDPOINTS } from '@/api/apiEnpoints';
import { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse, 
  UserDetailResponse,
  ApiResponse 
} from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await axiosClient.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    const response = await axiosClient.post<ApiResponse<RegisterResponse>>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  },

  myInfo: async (): Promise<ApiResponse<UserDetailResponse>> => {
    const response = await axiosClient.get<ApiResponse<UserDetailResponse>>(
      API_ENDPOINTS.USERS.MY_INFO
    );
    return response.data;
  },

  logout: () => {
    // Logout logic handled by Zustand store clearAuth
  },
};
