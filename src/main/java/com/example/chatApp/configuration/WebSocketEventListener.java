package com.example.chatApp.configuration;

import com.example.chatApp.service.UserSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import java.security.Principal;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final UserSessionService userSessionService;

    @EventListener
    public void onConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor  = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if(user == null || user.getName() == null) {
            return;
        }

        String userId = user.getName();
        String sessionId = accessor.getSessionId();

        userSessionService.saveSession(userId, sessionId);
        log.info("User {} connected with session {}", userId, sessionId);
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor  = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = accessor.getUser();
        if(user == null || user.getName() == null) {
            return;
        }
        String userId = user.getName();
        String sessionId = accessor.getSessionId();
        userSessionService.removeSession(userId, sessionId);
        log.info("User {} disconnected with session {}", userId, sessionId);
    }

}
