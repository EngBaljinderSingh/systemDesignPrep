package com.systemdesignprep.infrastructure.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();
    private final Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));

    public boolean tryConsume(String userId) {
        Bucket bucket = userBuckets.computeIfAbsent(userId, k -> Bucket4j.builder().addLimit(limit).build());
        return bucket.tryConsume(1);
    }
}
