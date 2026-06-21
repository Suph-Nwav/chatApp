package com.example.chatApp.mapper;

import com.example.chatApp.common.ConversationType;
import com.example.chatApp.dto.response.ConversationDetailResponse;
import com.example.chatApp.dto.response.CreateConversationResponse;
import com.example.chatApp.dto.response.ParticipantResponse;
import com.example.chatApp.entity.Conversation;
import com.example.chatApp.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
@RequiredArgsConstructor
public class ConversationMapper {

    private final UserSessionService userSessionService;

    public CreateConversationResponse toConversationResponse(String creatorId, Conversation conversation) {
        ConversationType conversationType = conversation.getConversationType();

        CreateConversationResponse response = CreateConversationResponse.builder()
                .id(conversation.getId())
                .conversationType(conversationType)
                .participantInfo(conversation.getParticipants().stream()
                        .map(p -> ParticipantResponse.builder()
                                .userId(p.getUser().getId())
                                .username(p.getUser().getUsername())
                                .build())
                        .toList())
                .createdAt(conversation.getCreatedAt())
                .build();

        response.setName(resolveConversationName(creatorId, conversation));

        if (conversationType != ConversationType.PRIVATE) {
            response.setConversationAvatar(conversation.getConversationAvatar());
        }

        return response;
    }

    public ConversationDetailResponse toConversationDetailResponse(String creatorId, Conversation conversation) {
        ConversationType conversationType = conversation.getConversationType();

        ConversationDetailResponse response = ConversationDetailResponse.builder()
                .id(conversation.getId())
                .conversationType(conversationType)
                .participantInfo(conversation.getParticipants().stream()
                        .map(p -> ParticipantResponse.builder()
                                .userId(p.getUser().getId())
                                .username(p.getUser().getUsername())
                                .build())
                        .toList())
                .lastMessageId(conversation.getLastMessageId())
                .lastMessageContent(conversation.getLastMessageContent())
                .lastMessageTime(conversation.getLastMessageTime())
                .createdAt(conversation.getCreatedAt())
                .build();

        response.setName(resolveConversationName(creatorId, conversation));

        if (conversationType == ConversationType.PRIVATE) {
            conversation.getParticipants().stream()
                    .filter(p -> !p.getUser().getId().equals(creatorId))
                    .findFirst()
                    .ifPresent(p -> {
                        String otherUserId = p.getUser().getId();
                        boolean isOnline = userSessionService.isOnline(p.getUser().getId());
                        String lastOnlineAt = userSessionService.getPresence(otherUserId)
                                .map(presence -> formatLastOnlineAt(presence.getLastOnlineAt()))
                                .orElse(null);

                        response.setIsOnline(isOnline);
                        response.setLastOnlineAt(lastOnlineAt);
                    });
        } else {
            boolean anyOnline = conversation.getParticipants().stream()
                    .filter(p -> !p.getUser().getId().equals(creatorId))
                    .anyMatch(p -> userSessionService.isOnline(p.getUser().getId()));

            response.setIsOnline(anyOnline);
        }

        if (conversationType != ConversationType.PRIVATE) {
            response.setConversationAvatar(conversation.getConversationAvatar());
        }

        return response;
    }



    private String resolveConversationName(String creatorId, Conversation conversation) {
        if (conversation.getConversationType() == ConversationType.PRIVATE) {
            return conversation.getParticipants().stream()
                    .filter(p -> !p.getUser().getId().equals(creatorId))
                    .findFirst()
                    .map(p -> p.getUser().getUsername())
                    .orElse(null);
        }
        return conversation.getName();
    }

    private String formatLastOnlineAt(Instant lastOnlineAt) {
        if (lastOnlineAt == null) return null;

        long minutes = Duration.between(lastOnlineAt, Instant.now()).toMinutes();

        if (minutes < 1)    return "Vừa hoạt động xong";
        if (minutes < 60)   return "Hoạt động " + minutes + " phút trước";
        if (minutes < 1440) return "Hoạt động " + (minutes / 60) + " giờ trước";
        return "Hoạt động " + (minutes / 1440) + " ngày trước";
    }

}