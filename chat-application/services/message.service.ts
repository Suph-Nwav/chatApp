import axiosClient from '@/api/axioClient';
import { API_ENDPOINTS } from '@/api/apiEnpoints';
import {
  ApiResponse,
  PageResponse,
  ChatMessageResponse,
  ChatMessageRequest,
} from '@/types';

export const messageService = {
  getMessages: async (
      conversationId: string,
      page: number = 1,
      size: number = 50
  ): Promise<ApiResponse<PageResponse<ChatMessageResponse>>> => {
    const response = await axiosClient.get<ApiResponse<PageResponse<ChatMessageResponse>>>(
        API_ENDPOINTS.MESSAGES.GET_BY_CONVERSATION(conversationId),
        { params: { page, size } }
    );
    return response.data;
  },

  sendMessage: async (
      data: ChatMessageRequest & { files?: File[] } // Ép kiểu tạm thời để nhận mảng files
  ): Promise<ApiResponse<ChatMessageResponse>> => {

    // 1. Tạo một "thùng carton" FormData
    const formData = new FormData();

    // 2. Nhét các thông tin chữ vào thùng
    if (data.tempId) formData.append('tempId', data.tempId);
    formData.append('conversationId', data.conversationId);
    if (data.content) formData.append('content', data.content);
    formData.append('messageType', data.messageType);

    // 3. Nhét file vật lý vào thùng (nếu có)
    // Chữ 'files' ở đây PHẢI KHỚP với tên biến List<MultipartFile> files ở Spring Boot
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    // 4. Giao thùng carton cho Axios gửi đi
    // Axios sẽ tự động hiểu đây là FormData và sinh ra header multipart/form-data chuẩn xác
    const response = await axiosClient.post<ApiResponse<ChatMessageResponse>>(
        API_ENDPOINTS.MESSAGES.SEND,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Bắt buộc Axios dùng chuẩn gửi file
          },
        }
    );

    return response.data;
  },
};