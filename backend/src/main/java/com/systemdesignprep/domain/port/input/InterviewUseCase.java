package com.systemdesignprep.domain.port.input;

import com.systemdesignprep.domain.model.DifficultyLevel;
import com.systemdesignprep.domain.model.InterviewSession;

import java.util.UUID;

/**
 * Input Port — driving side of the hexagon.
 * Defines what the application can do regarding interview lifecycle.
 */
public interface InterviewUseCase {

    InterviewSession startInterview(UUID userId, String problemTitle,
                                    String problemDescription, DifficultyLevel difficulty);

    InterviewSession getSession(UUID sessionId);

    InterviewSession advancePhase(UUID sessionId);

    String sendMessage(UUID sessionId, String userMessage);
}
