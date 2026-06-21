package com.example.chatApp.dto.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.example.chatApp.common.ConversationType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // Không serialize các field null
public class ConversationDetailResponse {
    private String id;
    private ConversationType conversationType;
    private String name; // Với PRIVATE: tên người còn lại, với GROUP: tên nhóm
    private String conversationAvatar; // Chỉ có với GROUP
    private List<ParticipantResponse> participantInfo; // Danh sách participants

    // Thông tin tin nhắn cuối cùng
    private String lastMessageId;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;
    private Boolean isOnline;
    private String lastOnlineAt;
    private LocalDateTime createdAt;
}