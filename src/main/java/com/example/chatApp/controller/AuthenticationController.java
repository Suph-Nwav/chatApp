package com.example.chatApp.controller;

import com.example.chatApp.dto.request.LoginRequest;
import com.example.chatApp.dto.response.ApiResponse;
import com.example.chatApp.dto.response.LoginResponse;
import com.example.chatApp.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
        var data = authenticationService.login(request);

        return ApiResponse.<LoginResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Login successfully")
                .data(data)
                .build();
    }
}