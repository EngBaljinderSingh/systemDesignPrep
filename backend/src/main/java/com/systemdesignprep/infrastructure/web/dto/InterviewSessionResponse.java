package com.systemdesignprep.infrastructure.web.dto;

import com.systemdesignprep.domain.model.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InterviewSessionResponse(
        UUID id,
        UUID userId,
        String problemTitle,
        DifficultyLevel difficulty,
        InterviewPhase currentPhase,
        CanvasState canvasState,
        List<ConversationTurnDto> conversationHistory,
        List<FeedbackDto> feedbackItems,
        Instant createdAt,
        Instant updatedAt
) {
    public record ConversationTurnDto(
            ConversationTurn.Role role,
            String content,
            InterviewPhase phase,
            Instant timestamp
    ) {}

    public record FeedbackDto(
            UUID id,
            InterviewPhase phase,
            Feedback.FeedbackCategory category,
            String content,
            String targetComponentId,
            int score,
            Instant createdAt
    ) {}
}
