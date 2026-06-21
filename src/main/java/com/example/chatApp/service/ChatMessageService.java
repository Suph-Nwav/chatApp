package com.example.chatApp.service;

import com.example.chatApp.dto.request.ChatMessageRequest;
import com.example.chatApp.dto.response.ChatMessageResponse;
import com.example.chatApp.dto.response.MessageMediaResponse;
import com.example.chatApp.dto.response.PageResponse;
import com.example.chatApp.entity.ChatMessage;
import com.example.chatApp.entity.Conversation;
import com.example.chatApp.entity.MessageMedia;
import com.example.chatApp.entity.User;
import com.example.chatApp.exception.AppException;
import com.example.chatApp.exception.ErrorCode;
import com.example.chatApp.repository.ChatMessageRepository;
import com.example.chatApp.repository.ConversationRepository;
import com.example.chatApp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    // Khai báo thư mục lưu trữ file
    private final String UPLOAD_DIR = "uploads/";

    @Transactional(rollbackFor = Exception.class)
    public ChatMessageResponse sendChatMessage(String senderId, ChatMessageRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Conversation conversation = conversationRepository.findByIdAndMember(request.conversationId(), senderId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_CONVERSATION_MEMBER));

        // XỬ LÝ LƯU FILE VẬT LÝ
        List<MessageMedia> media = new ArrayList<>();
        if (request.files() != null && !request.files().isEmpty()) {
            for (MultipartFile file : request.files()) {
                try {
                    // 1. Tạo thư mục nếu chưa tồn tại
                    Path uploadPath = Paths.get(UPLOAD_DIR);
                    if (!Files.exists(uploadPath)) {
                        Files.createDirectories(uploadPath);
                    }

                    // 2. Đổi tên file để tránh trùng lặp
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);

                    // 3. Copy file từ request vào máy tính
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    // 4. Tạo đường dẫn URL ảo trả về cho Frontend (giả định đang chạy port 8088)
                    String fileUrl = "http://localhost:8088/uploads/" + fileName;

                    // 5. Build đối tượng MessageMedia
                    media.add(MessageMedia.builder()
                            .fileName(file.getOriginalFilename())
                            .fileType(file.getContentType())
                            .thumbnailUrl(fileUrl)
                            .build());
                } catch (IOException e) {
                    throw new RuntimeException("Lỗi khi lưu file: " + e.getMessage());
                }
            }
        }

        String safeContent = (request.content() != null) ? request.content() : "";

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(safeContent)
                .messageType(request.messageType())
                .mediaFiles(media) // Gắn danh sách media đã xử lý vào message
                .build();

        chatMessageRepository.save(message);

        conversation.setLastMessageId(message.getId());
        conversation.setLastMessageContent(message.getContent() != null ? message.getContent() : "Đã gửi file đính kèm");
        conversation.setLastMessageTime(message.getSentAt());
        conversationRepository.save(conversation);

        List<String> recipientIds = conversation.getParticipants()
                .stream()
                .filter(participant -> !participant.getUser().getId().equals(senderId))
                .map(participant -> participant.getUser().getId())
                .toList();

        ChatMessageResponse response = ChatMessageResponse.builder()
                .id(message.getId())
                .tempId(request.tempId())
                .conversationId(message.getConversation().getId())
                .conversationAvatar(message.getConversation().getConversationAvatar())
                .senderId(sender.getId())
                .senderName(sender.getUsername())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .messageMedia(message.getMediaFiles().stream()
                        .map(messageMedia -> MessageMediaResponse.builder()
                                .fileName(messageMedia.getFileName())
                                .fileType(messageMedia.getFileType())
                                .thumbnailUrl(messageMedia.getThumbnailUrl())
                                .uploadedAt(messageMedia.getUploadedAt())
                                .build())
                        .toList())
                .build();

        recipientIds.forEach(recipientId -> simpMessagingTemplate.convertAndSendToUser(recipientId, "/queue/messages", response));

        return response;
    }

    public PageResponse<ChatMessageResponse> getMessagesByConversationId(String conversationId, int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) throw new AppException(ErrorCode.UNAUTHORIZED);

        String userId = authentication.getName();

        Conversation conversation = conversationRepository.findByIdAndMember(conversationId, userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_CONVERSATION_MEMBER));

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "sentAt"));
        Page<ChatMessage> chatMessagePage = chatMessageRepository.findByConversationId(conversationId, pageable);

        List<ChatMessage> messages = chatMessagePage.getContent();

        List<ChatMessageResponse> responses = messages.stream()
                .map(message -> ChatMessageResponse.builder()
                        .id(message.getId())
                        .conversationId(conversation.getId())
                        .conversationAvatar(conversation.getConversationAvatar())
                        .senderId(message.getSender().getId())
                        .senderName(message.getSender().getUsername())
                        .content(message.getContent())
                        .messageType(message.getMessageType())
                        .messageMedia(message.getMediaFiles().stream()
                                .map(messageMedia -> MessageMediaResponse.builder()
                                        .fileName(messageMedia.getFileName())
                                        .fileType(messageMedia.getFileType())
                                        .thumbnailUrl(messageMedia.getThumbnailUrl())
                                        .uploadedAt(messageMedia.getUploadedAt())
                                        .build())
                                .toList())
                        .build())
                .toList();

        return PageResponse.<ChatMessageResponse>builder()
                .currentPage(page)
                .pageSize(pageable.getPageSize())
                .totalPages(chatMessagePage.getTotalPages())
                .totalElements(chatMessagePage.getTotalElements())
                .content(responses)
                .build();
    }
}