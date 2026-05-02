package com.systemdesignprep.infrastructure.cache;

import com.systemdesignprep.domain.model.InterviewSession;
import com.systemdesignprep.domain.port.output.SessionCachePort;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ConditionalOnProperty(name = "sdp.cache.provider", havingValue = "memory")
public class InMemorySessionCacheAdapter implements SessionCachePort {

    private static final Duration TTL = Duration.ofHours(2);

    private final ConcurrentHashMap<UUID, CacheEntry> store = new ConcurrentHashMap<>();

    @Override
    public void cache(InterviewSession session) {
        store.put(session.getId(), new CacheEntry(session, Instant.now().plus(TTL)));
    }

    @Override
    public Optional<InterviewSession> get(UUID sessionId) {
        CacheEntry entry = store.get(sessionId);
        if (entry == null) {
            return Optional.empty();
        }
        if (entry.expiresAt().isBefore(Instant.now())) {
            store.remove(sessionId);
            return Optional.empty();
        }
        return Optional.of(entry.session());
    }

    @Override
    public void evict(UUID sessionId) {
        store.remove(sessionId);
    }

    private record CacheEntry(InterviewSession session, Instant expiresAt) {}
}
