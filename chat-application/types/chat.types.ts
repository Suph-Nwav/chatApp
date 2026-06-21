export enum ConversationType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

// Bổ sung thêm MEDIA vào lỡ Backend trả về hoặc dùng chung
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  MEDIA = 'MEDIA',
}

export interface ParticipantResponse {
  userId: string;
  username: string;
  email: string;
}

export interface ConversationDetailResponse {
  id: string;
  conversationType: ConversationType;
  name: string;
  conversationAvatar: string | null;
  participantInfo: ParticipantResponse[];
  lastMessageId: string | null;
  lastMessageContent: string | null;
  lastMessageTime: string | null;
  createdAt: string;
  isOnline: boolean;
  lastOnlineAt: string | null;
}

// ĐÃ CẬP NHẬT: Khớp chính xác với các trường Spring Boot trả về
export interface MessageMediaResponse {
  fileName: string;
  fileType: string;
  thumbnailUrl: string;
  uploadedAt?: string;
}

export interface ChatMessageResponse {
  id: string;
  tempId: string | null;
  conversationId: string;
  conversationAvatar: string | null;
  senderId: string;
  senderName: string;
  content: string;
  messageType: MessageType | string;
  messageMedia: MessageMediaResponse[] | null;
  createdAt: string;
}

export interface CreateConversationRequest {
  name?: string;
  conversationAvatar?: string;
  conversationType: ConversationType;
  participantIds: string[];
}

export interface ChatMessageRequest {
  tempId?: string;
  conversationId: string;
  content?: string;
  messageType: MessageType | string;

  // ĐÃ CẬP NHẬT: Đổi thành mảng File để Axios có thể đóng gói FormData gửi lên server
  files?: File[];
}

// Đã xóa MessageMediaRequest vì bây giờ chúng ta gửi trực tiếp File vật lý qua FormData