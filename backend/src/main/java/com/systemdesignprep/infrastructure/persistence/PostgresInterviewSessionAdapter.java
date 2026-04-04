package com.systemdesignprep.infrastructure.persistence;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemdesignprep.domain.model.*;
import com.systemdesignprep.domain.port.output.InterviewSessionRepository;
import com.systemdesignprep.infrastructure.persistence.entity.InterviewSessionEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Driven Adapter — translates between Domain Aggregate and JPA Entity.
 * The domain layer never sees JPA annotations.
 */
@Component
public class PostgresInterviewSessionAdapter implements InterviewSessionRepository {

    private final JpaInterviewSessionRepository jpaRepository;
    private final ObjectMapper objectMapper;

    public PostgresInterviewSessionAdapter(JpaInterviewSessionRepository jpaRepository,
                                           ObjectMapper objectMapper) {
        this.jpaRepository = jpaRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public InterviewSession save(InterviewSession session) {
        InterviewSessionEntity entity = toEntity(session);
        jpaRepository.save(entity);
        return session;
    }

    @Override
    public Optional<InterviewSession> findById(UUID sessionId) {
        return jpaRepository.findById(sessionId).map(this::toDomain);
    }

    @Override
    public void deleteById(UUID sessionId) {
        jpaRepository.deleteById(sessionId);
    }

    // ── Mapping ──

    private InterviewSessionEntity toEntity(InterviewSession domain) {
        InterviewSessionEntity entity = new InterviewSessionEntity();
        entity.setId(domain.getId());
        entity.setUserId(domain.getUserId());
        entity.setProblemTitle(domain.getProblemTitle());
        entity.setProblemDescription(domain.getProblemDescription());
        entity.setDifficulty(domain.getDifficulty());
        entity.setCurrentPhase(domain.getCurrentPhase());
        entity.setCanvasStateJson(toJson(domain.getCanvasState()));
        entity.setConversationHistoryJson(toJson(domain.getConversationHistory()));
        entity.setFeedbackItemsJson(toJson(domain.getFeedbackItems()));
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
        return entity;
    }

    private InterviewSession toDomain(InterviewSessionEntity entity) {
        CanvasState canvasState = fromJson(entity.getCanvasStateJson(), CanvasState.class);
        List<ConversationTurn> history = fromJson(entity.getConversationHistoryJson(),
                new TypeReference<List<ConversationTurn>>() {});
        List<Feedback> feedback = fromJson(entity.getFeedbackItemsJson(),
                new TypeReference<List<Feedback>>() {});

        return InterviewSession.reconstitute(
                entity.getId(), entity.getUserId(), entity.getProblemTitle(),
                entity.getProblemDescription(), entity.getDifficulty(),
                entity.getCurrentPhase(),
                canvasState != null ? canvasState : CanvasState.empty(),
                history != null ? history : List.of(),
                feedback != null ? feedback : List.of(),
                entity.getCreatedAt(), entity.getUpdatedAt()
        );
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize to JSON", e);
        }
    }

    private <T> T fromJson(String json, Class<T> type) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, type);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to deserialize JSON", e);
        }
    }

    private <T> T fromJson(String json, TypeReference<T> typeRef) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, typeRef);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to deserialize JSON", e);
        }
    }
}
