package com.example.chatApp.service;

import com.example.chatApp.entity.UserPresence;
import com.example.chatApp.entity.UserSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserSessionService {

    private static final String SESSION_PREFIX  = "ws:session:";
    private static final String USER_SESSIONS   = "ws:user:%s:sessions";
    private static final String PRESENCE_PREFIX = "ws:presence:";

    private static final Duration SESSION_TTL  = Duration.ofHours(24);
    private static final Duration PRESENCE_TTL = Duration.ofDays(30);

    private final RedisTemplate<String, Object> redisTemplate;
    private final JsonMapper jsonMapper;

    public void saveSession(String userId, String sessionId) {
        UserSession userSession = UserSession.builder()
                .userId(userId)
                .sessionId(sessionId)
                .connectedAt(Instant.now())
                .build();

        redisTemplate.opsForValue().set(SESSION_PREFIX + sessionId, userSession, SESSION_TTL);

        String userSessionsKey = String.format(USER_SESSIONS, userId);

        redisTemplate.opsForSet().add(userSessionsKey, sessionId);
        redisTemplate.expire(userSessionsKey, SESSION_TTL);
    }

    public void removeSession(String userId, String sessionId) {
        redisTemplate.delete(SESSION_PREFIX + sessionId);

        String userSessionKey = String.format(USER_SESSIONS, userId);
        redisTemplate.opsForSet().remove(userSessionKey, sessionId);

        if(!isOnline(userId)) {
            UserPresence userPresence = UserPresence.builder()
                    .userId(userId)
                    .lastOnlineAt(Instant.now())
                    .build();

            redisTemplate.opsForValue().set(PRESENCE_PREFIX + userId, userPresence, PRESENCE_TTL);
        }

    }

    public boolean isOnline(String userId) {
        String userSessionsKey = String.format(USER_SESSIONS, userId);
        Long size = redisTemplate.opsForSet().size(userSessionsKey);
        return size != null && size > 0;
    }

    public Optional<UserPresence> getPresence(String userId) {
        Object raw = redisTemplate.opsForValue().get(PRESENCE_PREFIX + userId);
        if (raw == null) return Optional.empty();

        return Optional.of(jsonMapper.convertValue(raw, UserPresence.class));
    }
}