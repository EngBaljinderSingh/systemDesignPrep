package com.systemdesignprep.domain.port.output;

import com.systemdesignprep.domain.model.InterviewSession;

import java.util.Optional;
import java.util.UUID;

/**
 * Output Port — driven side for session caching (Redis).
 */
public interface SessionCachePort {

    void cache(InterviewSession session);

    Optional<InterviewSession> get(UUID sessionId);

    void evict(UUID sessionId);
}
