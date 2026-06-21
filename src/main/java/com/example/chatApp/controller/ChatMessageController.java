package com.example.chatApp.controller;

import com.example.chatApp.dto.request.ChatMessageRequest;
import com.example.chatApp.dto.response.ApiResponse;
import com.example.chatApp.dto.response.ChatMessageResponse;
import com.example.chatApp.dto.response.PageResponse;
import com.example.chatApp.service.ChatMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chat-messages")
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    // Đã thêm consumes multipart/form-data và đổi @RequestBody thành @ModelAttribute
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    ApiResponse<ChatMessageResponse> sendChatMessage(
            @AuthenticationPrincipal Jwt jwt,
            @ModelAttribute @Valid ChatMessageRequest request
    ) {
        var senderId = jwt.getSubject();
        var data = chatMessageService.sendChatMessage(senderId, request);

        return ApiResponse.<ChatMessageResponse>builder()
                .code(HttpStatus.CREATED.value())
                .message("Chat message sent successfully")
                .data(data)
                .build();
    }

    @GetMapping("/conversations/{conversationId}/messages")
    ApiResponse<PageResponse<ChatMessageResponse>> getMessages(
            @PathVariable String conversationId,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "20") int size
    ) {
        var data = chatMessageService.getMessagesByConversationId(conversationId, page, size);
        return ApiResponse.<PageResponse<ChatMessageResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Messages retrieved successfully")
                .data(data)
                .build();
    }
}