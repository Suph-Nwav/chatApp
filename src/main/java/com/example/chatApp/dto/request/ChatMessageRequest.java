package com.example.chatApp.dto.request;

import com.example.chatApp.common.MessageType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public record ChatMessageRequest(

        String tempId, // Temporary ID từ client để map với message đã gửi (optimistic UI)

        @NotBlank(message = "Conversation id is required")
        String conversationId, // ID của conversation

        String content, // Nội dung tin nhắn (bắt buộc với TEXT, optional với MEDIA)

        @NotNull(message = "Message type is required")
        MessageType messageType, // TEXT hoặc MEDIA

        // ĐÂY CHÍNH LÀ ĐIỂM MẤU CHỐT: Dùng MultipartFile để hứng file vật lý
        List<MultipartFile> files
) {
}