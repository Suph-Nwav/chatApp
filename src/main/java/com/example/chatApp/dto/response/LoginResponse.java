package com.example.chatApp.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LoginResponse {
    private String userId;
    private String accessToken;
    private String refreshToken;
}
