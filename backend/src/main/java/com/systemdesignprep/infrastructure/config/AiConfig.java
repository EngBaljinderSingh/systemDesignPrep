package com.systemdesignprep.infrastructure.config;

import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    private static final Logger log = LoggerFactory.getLogger(AiConfig.class);

    @Value("${ai.provider:gemini}")
    private String aiProvider;

    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${ai.gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${ai.claude.api-key:}")
    private String claudeApiKey;

    @Value("${ai.claude.model:claude-3-5-sonnet-20241022}")
    private String claudeModel;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return switch (aiProvider.toLowerCase()) {
            case "claude", "anthropic" -> {
                log.info("Configuring Anthropic Claude as AI provider");
                yield AnthropicChatModel.builder()
                        .apiKey(claudeApiKey)
                        .modelName(claudeModel)
                        .maxTokens(2048)
                        .build();
            }
            default -> {
                log.info("Configuring Google Gemini as AI provider");
                yield GoogleAiGeminiChatModel.builder()
                        .apiKey(geminiApiKey)
                        .modelName(geminiModel)
                        .maxOutputTokens(2048)
                        .build();
            }
        };
    }
}
