package com.systemdesignprep.infrastructure.ai;

import java.util.Optional;

/**
 * Port for semantic prompt/response caching.
 * Implementations differ by cache provider (Redis vector store vs. no-op).
 */
public interface SemanticCache {
    Optional<String> getCachedResponse(String prompt);
    void cacheResponse(String prompt, String response);
}
