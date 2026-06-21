package com.example.chatApp.controller;

import com.example.chatApp.dto.request.CreateUserRequest;
import com.example.chatApp.dto.response.ApiResponse;
import com.example.chatApp.dto.response.CreateUserResponse;
import com.example.chatApp.dto.response.PageResponse;
import com.example.chatApp.dto.response.UserDetailResponse;
import com.example.chatApp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<CreateUserResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        var data = userService.createUser(request);

        return ApiResponse.<CreateUserResponse>builder()
                .code(HttpStatus.OK.value())
                .message("User created successfully")
                .data(data)
                .build();
    }

    @GetMapping
    public ApiResponse<UserDetailResponse> myInfo(@AuthenticationPrincipal Jwt jwt) {
        var userId = jwt.getSubject();
        var data = userService.myInfo(userId);

        return ApiResponse.<UserDetailResponse>builder()
                .code(HttpStatus.OK.value())
                .message("User info retrieved successfully")
                .data(data)
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<UserDetailResponse>> searchUser(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "5") int size,
            @RequestParam(required = false) String keyword
    ) {
        var data = userService.searchUsers(keyword, page, size);
        return ApiResponse.<PageResponse<UserDetailResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Users retrieved successfully")
                .data(data)
                .build();
    }

}