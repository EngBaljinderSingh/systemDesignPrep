package com.systemdesignprep.infrastructure.ai;

import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import java.util.Optional;

/**
 * Redis-backed semantic cache. Only active when sdp.cache.provider=redis (the default).
 * In lowcost/memory mode, {@link NoOpSemanticCache} is used instead.
 */
@Service
@ConditionalOnProperty(name = "sdp.cache.provider", havingValue = "redis", matchIfMissing = true)
public class SemanticCacheService implements SemanticCache {
    private final VectorStore vectorStore;

    public SemanticCacheService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Override
    public Optional<String> getCachedResponse(String prompt) {
        var results = vectorStore.similaritySearch(
            org.springframework.ai.vectorstore.SearchRequest.query(prompt).withTopK(1)
        );
        if (results != null && !results.isEmpty()) {
            return Optional.ofNullable(results.get(0).getContent());
        }
        return Optional.empty();
    }

    @Override
    public void cacheResponse(String prompt, String response) {
        var doc = new org.springframework.ai.document.Document(response);
        vectorStore.add(java.util.List.of(doc));
    }
}
