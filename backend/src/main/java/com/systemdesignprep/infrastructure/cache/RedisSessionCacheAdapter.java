package com.systemdesignprep.infrastructure.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemdesignprep.domain.model.InterviewSession;
import com.systemdesignprep.domain.port.output.SessionCachePort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Component
@ConditionalOnProperty(name = "sdp.cache.provider", havingValue = "redis", matchIfMissing = true)
public class RedisSessionCacheAdapter implements SessionCachePort {

    private static final Logger log = LoggerFactory.getLogger(RedisSessionCacheAdapter.class);
    private static final String KEY_PREFIX = "session:";
    private static final Duration TTL = Duration.ofHours(2);

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public RedisSessionCacheAdapter(StringRedisTemplate redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void cache(InterviewSession session) {
        try {
            String json = objectMapper.writeValueAsString(session);
            redisTemplate.opsForValue().set(key(session.getId()), json, TTL);
        } catch (Exception e) {
            log.warn("Failed to cache session {}: {}", session.getId(), e.getMessage());
        }
    }

    @Override
    public Optional<InterviewSession> get(UUID sessionId) {
        try {
            String json = redisTemplate.opsForValue().get(key(sessionId));
            if (json == null) return Optional.empty();
            return Optional.of(objectMapper.readValue(json, InterviewSession.class));
        } catch (Exception e) {
            log.warn("Failed to retrieve or deserialize cached session {}: {}", sessionId, e.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public void evict(UUID sessionId) {
        try {
            redisTemplate.delete(key(sessionId));
        } catch (Exception e) {
            log.warn("Failed to evict cached session {}: {}", sessionId, e.getMessage());
        }
    }

    private String key(UUID sessionId) {
        return KEY_PREFIX + sessionId.toString();
    }
}
