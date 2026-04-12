package com.systemdesignprep.domain.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Aggregate Root — represents a single mock interview session.
 * Encapsulates the interview state machine and all domain invariants.
 * This is a pure domain object with zero framework dependencies.
 */
public class InterviewSession {

    private UUID id;
    private UUID userId;
    private String problemTitle;
    private String problemDescription;
    private DifficultyLevel difficulty;
    private InterviewPhase currentPhase;
    private CanvasState canvasState;
    private final List<ConversationTurn> conversationHistory;
    private final List<Feedback> feedbackItems;
    private Instant createdAt;
    private Instant updatedAt;

    private InterviewSession(Builder builder) {
        this.id = builder.id;
        this.userId = builder.userId;
        this.problemTitle = builder.problemTitle;
        this.problemDescription = builder.problemDescription;
        this.difficulty = builder.difficulty;
        this.currentPhase = InterviewPhase.INTRODUCTION;
        this.canvasState = CanvasState.empty();
        this.conversationHistory = new ArrayList<>();
        this.feedbackItems = new ArrayList<>();
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    /**
     * Factory method — the only way to start a new interview.
     */
    public static InterviewSession start(UUID userId, String problemTitle,
                                         String problemDescription, DifficultyLevel difficulty) {
        return new Builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .problemTitle(problemTitle)
                .problemDescription(problemDescription)
                .difficulty(difficulty)
                .build();
    }

    /**
     * Reconstitution constructor for the persistence adapter.
     * This method is used by Jackson to deserialize the object from JSON/Redis cache.
     */
    @JsonCreator
    public static InterviewSession reconstitute(
            @JsonProperty("id") UUID id,
            @JsonProperty("userId") UUID userId,
            @JsonProperty("problemTitle") String problemTitle,
            @JsonProperty("problemDescription") String problemDescription,
            @JsonProperty("difficulty") DifficultyLevel difficulty,
            @JsonProperty("currentPhase") InterviewPhase phase,
            @JsonProperty("canvasState") CanvasState canvasState,
            @JsonProperty("conversationHistory") List<ConversationTurn> history,
            @JsonProperty("feedbackItems") List<Feedback> feedback,
            @JsonProperty("createdAt") Instant createdAt,
            @JsonProperty("updatedAt") Instant updatedAt) {
        InterviewSession session = new InterviewSession(new Builder()
                .id(id).userId(userId).problemTitle(problemTitle)
                .problemDescription(problemDescription).difficulty(difficulty));
        session.currentPhase = phase;
        session.canvasState = canvasState;
        if (history != null) session.conversationHistory.addAll(history);
        if (feedback != null) session.feedbackItems.addAll(feedback);
        session.createdAt = createdAt;
        session.updatedAt = updatedAt;
        return session;
    }

    // ── Domain Behaviors ──

    public void advancePhase() {
        if (currentPhase.isTerminal()) {
            throw new IllegalStateException("Interview is already complete.");
        }
        this.currentPhase = currentPhase.next();
        this.updatedAt = Instant.now();
    }

    public void advanceTo(InterviewPhase targetPhase) {
        if (!currentPhase.canAdvanceTo(targetPhase)) {
            throw new IllegalStateException(
                    "Cannot transition from %s to %s".formatted(currentPhase, targetPhase));
        }
        this.currentPhase = targetPhase;
        this.updatedAt = Instant.now();
    }

    public void updateCanvas(CanvasState newState) {
        this.canvasState = newState;
        this.updatedAt = Instant.now();
    }

    public void addConversationTurn(ConversationTurn turn) {
        this.conversationHistory.add(turn);
        this.updatedAt = Instant.now();
    }

    public void addFeedback(Feedback feedback) {
        this.feedbackItems.add(feedback);
        this.updatedAt = Instant.now();
    }

    public boolean isComplete() {
        return currentPhase.isTerminal();
    }

    // ── Accessors (immutable views) ──

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public String getProblemTitle() { return problemTitle; }
    public String getProblemDescription() { return problemDescription; }
    public DifficultyLevel getDifficulty() { return difficulty; }
    public InterviewPhase getCurrentPhase() { return currentPhase; }
    public CanvasState getCanvasState() { return canvasState; }
    public List<ConversationTurn> getConversationHistory() { return Collections.unmodifiableList(conversationHistory); }
    public List<Feedback> getFeedbackItems() { return Collections.unmodifiableList(feedbackItems); }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    // ── Builder ──

    private static class Builder {
        private UUID id;
        private UUID userId;
        private String problemTitle;
        private String problemDescription;
        private DifficultyLevel difficulty;

        Builder id(UUID id) { this.id = id; return this; }
        Builder userId(UUID userId) { this.userId = userId; return this; }
        Builder problemTitle(String t) { this.problemTitle = t; return this; }
        Builder problemDescription(String d) { this.problemDescription = d; return this; }
        Builder difficulty(DifficultyLevel d) { this.difficulty = d; return this; }
        InterviewSession build() { return new InterviewSession(this); }
    }
}
