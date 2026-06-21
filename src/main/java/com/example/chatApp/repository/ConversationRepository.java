package com.example.chatApp.repository;

import com.example.chatApp.entity.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, String> {

    @EntityGraph(attributePaths = {"participants", "participants.user"})
    Optional<Conversation> findByParticipantHash(String participantHash);

    @Query("SELECT DISTINCT c FROM Conversation c JOIN c.participants p WHERE p.user.id = :userId ORDER BY c.lastMessageTime DESC NULLS LAST")
    Page<Conversation> findAllByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT DISTINCT c FROM Conversation c " +
            "LEFT JOIN FETCH c.participants p " +
            "LEFT JOIN FETCH p.user " +
            "WHERE c.id IN :conversationIds")
    List<Conversation> findByIdInWithParticipants(@Param("conversationIds") List<String> conversationIds);

    @Query("SELECT c FROM Conversation c WHERE c.id = :conversationId AND EXISTS (SELECT p FROM c.participants p WHERE p.user.id = :userId)")
    Optional<Conversation> findByIdAndMember(String conversationId, String userId);

}