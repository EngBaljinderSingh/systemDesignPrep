package com.systemdesignprep.domain.model;

import java.time.Instant;
import java.util.UUID;

/**
 * Value Object — an immutable piece of AI-generated feedback
 * scoped to a specific interview phase and optionally a canvas component.
 */
public record Feedback(
        UUID id,
        InterviewPhase phase,
        FeedbackCategory category,
        String content,
        String targetComponentId,
        int score,
        Instant createdAt
) {
    public Feedback {
        if (score < 0 || score > 10) {
            throw new IllegalArgumentException("Score must be between 0 and 10, got: " + score);
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Feedback content must not be blank.");
        }
    }

    public static Feedback create(InterviewPhase phase, FeedbackCategory category,
                                  String content, String targetComponentId, int score) {
        return new Feedback(UUID.randomUUID(), phase, category, content,
                targetComponentId, score, Instant.now());
    }

    public enum FeedbackCategory {
        SCALABILITY,
        RELIABILITY,
        CONSISTENCY,
        LATENCY,
        SECURITY,
        COST,
        GENERAL
    }
}
