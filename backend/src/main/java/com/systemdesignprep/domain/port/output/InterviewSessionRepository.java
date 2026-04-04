package com.systemdesignprep.domain.port.output;

import com.systemdesignprep.domain.model.InterviewSession;

import java.util.Optional;
import java.util.UUID;

/**
 * Output Port — driven side of the hexagon.
 * Defines the contract for persisting InterviewSession aggregates.
 * Implementations live in the infrastructure layer.
 */
public interface InterviewSessionRepository {

    InterviewSession save(InterviewSession session);

    Optional<InterviewSession> findById(UUID sessionId);

    void deleteById(UUID sessionId);
}
