package com.systemdesignprep.application.service;

import com.systemdesignprep.domain.model.ConversationTurn;
import com.systemdesignprep.domain.model.DifficultyLevel;
import com.systemdesignprep.domain.model.InterviewSession;
import com.systemdesignprep.domain.port.input.InterviewUseCase;
import com.systemdesignprep.domain.port.output.AiGateway;
import com.systemdesignprep.domain.port.output.InterviewSessionRepository;
import com.systemdesignprep.domain.port.output.SessionCachePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class InterviewService implements InterviewUseCase {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewSessionRepository repository;
    private final SessionCachePort cache;
    private final AiGateway aiGateway;

    public InterviewService(InterviewSessionRepository repository,
                            SessionCachePort cache,
                            AiGateway aiGateway) {
        this.repository = repository;
        this.cache = cache;
        this.aiGateway = aiGateway;
    }

    @Override
    public InterviewSession startInterview(UUID userId, String problemTitle,
                                           String problemDescription, DifficultyLevel difficulty) {
        log.info("Starting interview session for user={} problem={}", userId, problemTitle);

        InterviewSession session = InterviewSession.start(userId, problemTitle, problemDescription, difficulty);

        String introMessage = aiGateway.generateInterviewResponse(
                session.getCurrentPhase(),
                session.getConversationHistory(),
                session.getCanvasState(),
                "Start the interview for: " + problemTitle
        );

        session.addConversationTurn(ConversationTurn.assistant(introMessage, session.getCurrentPhase()));

        InterviewSession persisted = repository.save(session);
        cache.cache(persisted);

        log.info("Interview session created: id={} phase={}", persisted.getId(), persisted.getCurrentPhase());
        return persisted;
    }

    @Override
    @Transactional(readOnly = true)
    public InterviewSession getSession(UUID sessionId) {
        return cache.get(sessionId)
                .orElseGet(() -> {
                    InterviewSession session = repository.findById(sessionId)
                            .orElseThrow(() -> new SessionNotFoundException(sessionId));
                    cache.cache(session);
                    return session;
                });
    }

    @Override
    public InterviewSession advancePhase(UUID sessionId) {
        InterviewSession session = getSession(sessionId);
        session.advancePhase();

        log.info("Session {} advanced to phase {}", sessionId, session.getCurrentPhase());

        InterviewSession persisted = repository.save(session);
        cache.cache(persisted);
        return persisted;
    }

    @Override
    public String sendMessage(UUID sessionId, String userMessage) {
        InterviewSession session = getSession(sessionId);

        session.addConversationTurn(ConversationTurn.user(userMessage, session.getCurrentPhase()));

        String aiResponse = aiGateway.generateInterviewResponse(
                session.getCurrentPhase(),
                session.getConversationHistory(),
                session.getCanvasState(),
                userMessage
        );

        session.addConversationTurn(ConversationTurn.assistant(aiResponse, session.getCurrentPhase()));

        repository.save(session);
        cache.cache(session);

        return aiResponse;
    }
}
