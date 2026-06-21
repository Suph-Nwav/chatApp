package com.example.chatApp.dto.response;


import lombok.Builder;

@Builder
public record ParticipantResponse(
        String userId,    // ID của participant
        String username   // Username của participant
) {
}
