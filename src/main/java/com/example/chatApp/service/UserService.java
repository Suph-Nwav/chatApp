package com.example.chatApp.service;

import com.example.chatApp.dto.request.CreateUserRequest;
import com.example.chatApp.dto.response.CreateUserResponse;
import com.example.chatApp.dto.response.PageResponse;
import com.example.chatApp.dto.response.UserDetailResponse;
import com.example.chatApp.entity.Role;
import com.example.chatApp.entity.User;
import com.example.chatApp.exception.AppException;
import com.example.chatApp.exception.ErrorCode;
import com.example.chatApp.repository.RoleRepository;
import com.example.chatApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.chatApp.constant.AppConstant.USER_ROLE;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(rollbackFor = Exception.class)
    public CreateUserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        Role role = roleRepository.findByName(USER_ROLE)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(USER_ROLE)
                        .build()));
        user.addRole(role);

        userRepository.save(user);

        return CreateUserResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public UserDetailResponse myInfo(String userId) {
        return userRepository.findById(userId)
                .map(user -> UserDetailResponse.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .build())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    public PageResponse<UserDetailResponse> searchUsers(String keyword, int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null) throw new AppException(ErrorCode.UNAUTHORIZED);

        String userId = authentication.getName();

        Pageable pageable = PageRequest.of(page - 1, size);

        Page<User> userPage = userRepository.searchUsers(keyword, pageable);

        List<UserDetailResponse> content = userPage.getContent()
                .stream()
                .filter(user -> !user.getId().equals(userId))
                .map(user -> UserDetailResponse.builder()
                        .userId(user.getId())
                        .email(user.getEmail())
                        .username(user.getUsername())
                        .build())
                .toList();

        return PageResponse.<UserDetailResponse>builder()
                .currentPage(page)
                .pageSize(size)
                .totalPages(userPage.getTotalPages())
                .totalElements(userPage.getTotalElements())
                .content(content)
                .build();
    }

}