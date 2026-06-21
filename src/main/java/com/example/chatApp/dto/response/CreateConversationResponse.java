package com.example.chatApp.dto.response;

import com.example.chatApp.common.ConversationType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class CreateConversationResponse {
    private String id; // ID của conversation
    private String name; // Tên conversation (với PRIVATE: tên của người còn lại, với GROUP: tên nhóm)
    private String conversationAvatar; // Avatar (chỉ có với GROUP)
    private ConversationType conversationType; // PRIVATE hoặc GROUP
    private List<ParticipantResponse> participantInfo; // Danh sách thông tin participants
    private LocalDateTime createdAt; // Thời gian tạo
}
