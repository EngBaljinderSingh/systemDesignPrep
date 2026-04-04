package com.systemdesignprep.domain.model;

import java.time.Instant;

/**
 * Value Object — a single turn in the interview conversation (user or AI).
 */
public record ConversationTurn(
        Role role,
        String content,
        InterviewPhase phase,
        Instant timestamp
) {
    public ConversationTurn {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Conversation content must not be blank.");
        }
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }

    public static ConversationTurn user(String content, InterviewPhase phase) {
        return new ConversationTurn(Role.USER, content, phase, Instant.now());
    }

    public static ConversationTurn assistant(String content, InterviewPhase phase) {
        return new ConversationTurn(Role.ASSISTANT, content, phase, Instant.now());
    }

    public enum Role {
        USER,
        ASSISTANT
    }
}
