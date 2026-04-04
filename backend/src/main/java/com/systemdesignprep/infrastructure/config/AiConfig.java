package com.systemdesignprep.infrastructure.config;

import com.systemdesignprep.infrastructure.ai.FallbackChatModel;
import com.systemdesignprep.infrastructure.ai.FallbackChatModel.NamedModel;
import dev.langchain4j.model.anthropic.AnthropicChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class AiConfig {

    private static final Logger log = LoggerFactory.getLogger(AiConfig.class);

    @Value("${ai.gemini.api-key:}")
    private String geminiApiKey;

    @Value("${ai.gemini.model:gemini-2.0-flash}")
    private String geminiModel;

    @Value("${ai.claude.api-key:}")
    private String claudeApiKey;

    @Value("${ai.claude.model:claude-sonnet-4-20250514}")
    private String claudeModel;

    @Value("${ai.ollama.base-url:http://ollama:11434}")
    private String ollamaBaseUrl;

    @Value("${ai.ollama.model:llama3.2}")
    private String ollamaModel;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        List<NamedModel> chain = new ArrayList<>();

        // Gemini first (if API key is present)
        ChatLanguageModel gemini = buildGeminiIfConfigured();
        if (gemini != null) chain.add(new NamedModel("Gemini", gemini));

        // Claude second (if API key is present)
        ChatLanguageModel claude = buildClaudeIfConfigured();
        if (claude != null) chain.add(new NamedModel("Claude", claude));

        // Ollama always last — free, local, no key needed
        chain.add(new NamedModel("Ollama", buildOllama()));

        if (chain.size() == 1) {
            log.info("AI provider: Ollama only (no cloud API keys configured)");
            return chain.get(0).model();
        }

        log.info("AI provider chain: {}", chain.stream().map(NamedModel::name).toList());
        return new FallbackChatModel(chain);
    }

    // ── Private builders ──────────────────────────────────────────────────────

    private ChatLanguageModel buildGeminiIfConfigured() {
        if (geminiApiKey == null || geminiApiKey.isBlank()) return null;
        log.info("Building Google Gemini model ({})", geminiModel);
        return GoogleAiGeminiChatModel.builder()
                .apiKey(geminiApiKey)
                .modelName(geminiModel)
                .maxOutputTokens(2048)
                .build();
    }

    private ChatLanguageModel buildClaudeIfConfigured() {
        if (claudeApiKey == null || claudeApiKey.isBlank()) return null;
        log.info("Building Anthropic Claude model ({})", claudeModel);
        return AnthropicChatModel.builder()
                .apiKey(claudeApiKey)
                .modelName(claudeModel)
                .maxTokens(2048)
                .build();
    }

    private ChatLanguageModel buildOllama() {
        log.info("Building Ollama model ({}) at {}", ollamaModel, ollamaBaseUrl);
        return OllamaChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(ollamaModel)
                .build();
    }
}
