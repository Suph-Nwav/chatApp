package com.example.chatApp.entity;

import lombok.*;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserPresence {
    private String userId;
    private Instant lastOnlineAt;
}