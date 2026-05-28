package com.systemdesignprep.infrastructure.ai;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Optional;

/**
 * Redis-backed prompt/response cache.
 * Uses SHA-256 of the normalised prompt as the cache key so identical prompts
 * are served from cache without an embedding model.
 * Only active when sdp.cache.provider=redis (the default).
 * In lowcost/memory mode, {@link NoOpSemanticCache} is used instead.
 */
@Service
@ConditionalOnProperty(name = "sdp.cache.provider", havingValue = "redis", matchIfMissing = true)
public class SemanticCacheService implements SemanticCache {

    private static final String KEY_PREFIX = "sdp:cache:";
    private static final Duration TTL = Duration.ofHours(24);

    private final StringRedisTemplate redis;

    public SemanticCacheService(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @Override
    public Optional<String> getCachedResponse(String prompt) {
        String value = redis.opsForValue().get(KEY_PREFIX + hash(prompt));
        return Optional.ofNullable(value);
    }

    @Override
    public void cacheResponse(String prompt, String response) {
        redis.opsForValue().set(KEY_PREFIX + hash(prompt), response, TTL);
    }

    private static String hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(input.trim().toLowerCase().getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is guaranteed to be available in every JVM
            throw new IllegalStateException(e);
        }
    }
}
