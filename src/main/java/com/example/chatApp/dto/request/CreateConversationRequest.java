package com.example.chatApp.dto.request;

import com.example.chatApp.common.ConversationType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateConversationRequest(
        String name, // Tên conversation (bắt buộc với GROUP, không cần với PRIVATE)
        String conversationAvatar, // Avatar của nhóm (optional)

        @NotNull(message = "Conversation type is required")
        ConversationType conversationType, // PRIVATE hoặc GROUP

        @NotEmpty(message = "Participant ids are required")
        List<String> participantIds // Danh sách userId của người tham gia
) {
}
