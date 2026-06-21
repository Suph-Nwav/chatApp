package com.example.chatApp.entity;

import com.example.chatApp.common.ConversationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "conversations")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    private String conversationAvatar;

    private ConversationType conversationType;

    @Column(name = "participant_hash", unique = true)
    private String participantHash;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ConversationParticipant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();

    private LocalDateTime createdAt;

    private String lastMessageId;

    private String lastMessageContent;

    private LocalDateTime lastMessageTime;
    public void addParticipants(User user) {
        participants.add(ConversationParticipant.builder()
                .conversation(this) // Set relationship với conversation
                .user(user)         // Set relationship với user
                .build());
    }
}