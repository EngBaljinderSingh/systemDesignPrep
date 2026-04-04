package com.systemdesignprep.infrastructure.persistence.entity;

import com.systemdesignprep.domain.model.DifficultyLevel;
import com.systemdesignprep.domain.model.InterviewPhase;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interview_sessions")
public class InterviewSessionEntity {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "problem_title", nullable = false)
    private String problemTitle;

    @Column(name = "problem_description", columnDefinition = "TEXT")
    private String problemDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_phase", nullable = false)
    private InterviewPhase currentPhase;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "canvas_state", columnDefinition = "jsonb")
    private String canvasStateJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "conversation_history", columnDefinition = "jsonb")
    private String conversationHistoryJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "feedback_items", columnDefinition = "jsonb")
    private String feedbackItemsJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // JPA requires a no-arg constructor
    public InterviewSessionEntity() {}

    // ── Accessors ──

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getProblemTitle() { return problemTitle; }
    public void setProblemTitle(String problemTitle) { this.problemTitle = problemTitle; }

    public String getProblemDescription() { return problemDescription; }
    public void setProblemDescription(String problemDescription) { this.problemDescription = problemDescription; }

    public DifficultyLevel getDifficulty() { return difficulty; }
    public void setDifficulty(DifficultyLevel difficulty) { this.difficulty = difficulty; }

    public InterviewPhase getCurrentPhase() { return currentPhase; }
    public void setCurrentPhase(InterviewPhase currentPhase) { this.currentPhase = currentPhase; }

    public String getCanvasStateJson() { return canvasStateJson; }
    public void setCanvasStateJson(String canvasStateJson) { this.canvasStateJson = canvasStateJson; }

    public String getConversationHistoryJson() { return conversationHistoryJson; }
    public void setConversationHistoryJson(String conversationHistoryJson) { this.conversationHistoryJson = conversationHistoryJson; }

    public String getFeedbackItemsJson() { return feedbackItemsJson; }
    public void setFeedbackItemsJson(String feedbackItemsJson) { this.feedbackItemsJson = feedbackItemsJson; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
