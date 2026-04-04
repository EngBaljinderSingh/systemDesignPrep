package com.systemdesignprep.application.service;

import com.systemdesignprep.domain.model.CanvasState;
import com.systemdesignprep.domain.model.Feedback;
import com.systemdesignprep.domain.model.InterviewSession;
import com.systemdesignprep.domain.port.input.CanvasUseCase;
import com.systemdesignprep.domain.port.output.AiGateway;
import com.systemdesignprep.domain.port.output.InterviewSessionRepository;
import com.systemdesignprep.domain.port.output.SessionCachePort;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CanvasService implements CanvasUseCase {

    private static final Logger log = LoggerFactory.getLogger(CanvasService.class);

    private final InterviewSessionRepository repository;
    private final SessionCachePort cache;
    private final AiGateway aiGateway;
    private final ObjectMapper objectMapper;

    public CanvasService(InterviewSessionRepository repository,
                         SessionCachePort cache,
                         AiGateway aiGateway,
                         ObjectMapper objectMapper) {
        this.repository = repository;
        this.cache = cache;
        this.aiGateway = aiGateway;
        this.objectMapper = objectMapper;
    }

    @Override
    public void updateCanvas(UUID sessionId, CanvasState canvasState) {
        InterviewSession session = resolveSession(sessionId);
        session.updateCanvas(canvasState);

        repository.save(session);
        cache.cache(session);

        log.info("Canvas updated for session={} components={} connections={}",
                sessionId, canvasState.componentCount(), canvasState.connectionCount());
    }

    @Override
    public List<Feedback> analyzeCanvas(UUID sessionId) {
        InterviewSession session = resolveSession(sessionId);

        if (session.getCanvasState().isEmpty()) {
            log.warn("Canvas analysis requested for empty canvas. session={}", sessionId);
            return List.of();
        }

        String rawAnalysis = aiGateway.analyzeArchitecture(
                session.getCanvasState(), session.getCurrentPhase());

        List<Feedback> feedbackItems = parseFeedback(rawAnalysis, session);
        feedbackItems.forEach(session::addFeedback);

        repository.save(session);
        cache.cache(session);

        return feedbackItems;
    }

    private InterviewSession resolveSession(UUID sessionId) {
        return cache.get(sessionId)
                .orElseGet(() -> repository.findById(sessionId)
                        .orElseThrow(() -> new SessionNotFoundException(sessionId)));
    }

    private List<Feedback> parseFeedback(String rawAnalysis, InterviewSession session) {
        // TODO: Replace with structured LLM output parsing (LangChain4j structured output)
        return List.of(Feedback.create(
                session.getCurrentPhase(),
                Feedback.FeedbackCategory.GENERAL,
                rawAnalysis,
                null,
                5
        ));
    }
}
