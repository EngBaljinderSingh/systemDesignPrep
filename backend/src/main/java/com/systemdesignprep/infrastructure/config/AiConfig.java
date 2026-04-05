package com.systemdesignprep.infrastructure.config;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class AiConfig {
    private static final Logger log = LoggerFactory.getLogger(AiConfig.class);
    @Value("${ai.ollama.base-url:http://ollama:11434}")
    private String ollamaBaseUrl;
    @Value("${ai.ollama.model:llama3.2:1b}")
    private String ollamaModel;
    @Bean
    public ChatLanguageModel chatLanguageModel() {
        log.info("AI provider: Ollama ({}) at {}", ollamaModel, ollamaBaseUrl);
        return OllamaChatModel.builder()
                .baseUrl(ollamaBaseUrl)
                .modelName(ollamaModel)
                .build();
    }
}
