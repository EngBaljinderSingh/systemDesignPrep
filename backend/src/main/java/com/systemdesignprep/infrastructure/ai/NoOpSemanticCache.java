package com.systemdesignprep.infrastructure.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * No-op semantic cache used in lowcost/memory mode where Redis is not available.
 * Every lookup is a cache miss; responses are never stored.
 */
@Service
@ConditionalOnProperty(name = "sdp.cache.provider", havingValue = "memory")
public class NoOpSemanticCache implements SemanticCache {

    @Override
    public Optional<String> getCachedResponse(String prompt) {
        return Optional.empty();
    }

    @Override
    public void cacheResponse(String prompt, String response) {
        // intentional no-op
    }
}
