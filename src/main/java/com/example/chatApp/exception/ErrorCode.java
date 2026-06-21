package com.example.chatApp.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    INTERNAL_SERVER_ERROR(500, "Unknow Exception", HttpStatus.INTERNAL_SERVER_ERROR),

    FORBIDDEN(403, "Access denied. You do not have the required permissions to access this resource.", HttpStatus.FORBIDDEN),
    UNAUTHORIZED(401, "Authentication is required. Please provide a valid token to access this resource.", HttpStatus.UNAUTHORIZED),

    TOKEN_GENERATION_FAILED(500, "Failed to generate JWT token", HttpStatus.INTERNAL_SERVER_ERROR),

    USER_EXISTED(400, "User already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(404, "User not found", HttpStatus.NOT_FOUND),

    PARTICIPANT_NOT_FOUND(404, "One or more participants not found", HttpStatus.NOT_FOUND),
    INVALID_PARTICIPANT_COUNT(400, "Private conversation requires exactly 2 participants", HttpStatus.BAD_REQUEST),
    CONVERSATION_NAME_REQUIRED(400, "Conversation name is required", HttpStatus.BAD_REQUEST),
    GROUP_CONVERSATION_MINIMUM_THREE_PARTICIPANTS(400, "A group conversation must have at least three participants", HttpStatus.BAD_REQUEST),

    NOT_CONVERSATION_MEMBER(403, "You are not a member of this conversation", HttpStatus.FORBIDDEN),

    ;

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

}