package com.example.chatApp.exception;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private int code;
    private int status;
    private String message;
    private String error;
    private String path;
}
