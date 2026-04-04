package com.systemdesignprep.application.service;

import java.util.UUID;

public class SessionNotFoundException extends RuntimeException {

    private final UUID sessionId;

    public SessionNotFoundException(UUID sessionId) {
        super("Interview session not found: " + sessionId);
        this.sessionId = sessionId;
    }

    public UUID getSessionId() {
        return sessionId;
    }
}
