package com.systemdesignprep.infrastructure.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.data.redis.LettuceClientConfigurationBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@ConditionalOnProperty(name = "sdp.cache.provider", havingValue = "redis", matchIfMissing = true)
public class RedisConfig {

    private static final Logger log = LoggerFactory.getLogger(RedisConfig.class);

    @Value("${spring.data.redis.host:localhost}")
    private String host;

    @Value("${spring.data.redis.ssl.enabled:false}")
    private boolean sslEnabled;

    @Bean
    public LettuceClientConfigurationBuilderCustomizer lettuceCustomizer() {
        return clientConfigurationBuilder -> {
            // Automatically enable SSL for Upstash or if explicitly enabled
            if (sslEnabled || (host != null && host.contains("upstash.io"))) {
                log.info("Enabling SSL/TLS for Redis connection to {}", host);
                clientConfigurationBuilder.useSsl();
            }
            clientConfigurationBuilder.commandTimeout(Duration.ofSeconds(5));
        };
    }
}
