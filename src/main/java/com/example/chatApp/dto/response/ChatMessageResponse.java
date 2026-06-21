package com.example.chatApp.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.example.chatApp.common.MessageType;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
@JsonInclude(JsonInclude.Include.NON_NULL) // Không serialize các field null
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse implements Serializable {
    private String id; // Message ID từ database
    private String tempId; // Temporary ID từ client
    private String conversationId;
    private String conversationAvatar; // Avatar của conversation (cho GROUP)
    private String senderId;
    private String senderName;
    private String content;
    private MessageType messageType;
    private List<MessageMediaResponse> messageMedia;
    private LocalDateTime createdAt;
}