

package com.systemdesignprep.infrastructure.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.SystemMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.web.reactive.function.client.WebClientResponseException;
import java.util.ArrayList;

@Configuration
public class AiConfig {
    private static final Logger log = LoggerFactory.getLogger(AiConfig.class);

    @Value("${openai.api-key:}")
    private String apiKey;

    @Value("${openai.base-url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Bean
    public WebClient siliconFlowWebClient(
            @Value("${siliconflow.api-key:}") String siliconApiKey,
            @Value("${siliconflow.base-url:https://api.siliconflow.com/v1/chat/completions}") String siliconApiUrl) {
        String cleanKey = siliconApiKey != null ? siliconApiKey.trim().replaceAll("^\"|\"$", "").replaceAll("^'|'$", "") : "";
        log.info("Creating SiliconFlow WebClient with baseUrl={} and apiKey present={}", siliconApiUrl, !cleanKey.isEmpty());
        return WebClient.builder()
                .baseUrl(siliconApiUrl)
                .defaultHeader("Authorization", "Bearer " + cleanKey)
                .build();
    }

    @Bean
    public ChatLanguageModel siliconFlowChatLanguageModel(@Qualifier("siliconFlowWebClient") WebClient siliconFlowWebClient,
                                                        @Value("${siliconflow.model:deepseek-ai/deepseek-vl-1.3b}") String model) {
        log.info("Registering ChatLanguageModel bean for SiliconFlow with model={}", model);
        return messages -> {
            Map<String, Object> request = new HashMap<>();
            request.put("model", model);
            List<Map<String, String>> openAiMessages = messages.stream().map(msg -> {
                Map<String, String> m = new HashMap<>();
                if (msg instanceof UserMessage) {
                    m.put("role", "user");
                    m.put("content", msg.text());
                } else if (msg instanceof SystemMessage) {
                    m.put("role", "system");
                    m.put("content", msg.text());
                } else if (msg instanceof AiMessage) {
                    m.put("role", "assistant");
                    m.put("content", msg.text());
                } else {
                    m.put("role", "user");
                    m.put("content", msg.text());
                }
                return m;
            }).toList();
            request.put("messages", openAiMessages);

            Map<String, Object> response = siliconFlowWebClient.post()
                    .header("Content-Type", "application/json")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("No choices returned from SiliconFlow");
            }
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            return new dev.langchain4j.model.output.Response<>(AiMessage.from(content));
        };
    }

    @Bean
    public WebClient openRouterWebClient() {
        String cleanKey = apiKey != null ? apiKey.trim().replaceAll("^\"|\"$", "").replaceAll("^'|'$", "") : "";
        log.info("Creating OpenRouter WebClient with baseUrl={} and apiKey present={}", apiUrl, !cleanKey.isEmpty());
        return WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + cleanKey)
                .defaultHeader("HTTP-Referer", "https://systemdesignprep.pages.dev")
                .defaultHeader("X-Title", "System Design Prep")
                .build();
    }

    @Bean
    @Primary
    @SuppressWarnings({"unchecked", "rawtypes"})
    public ChatLanguageModel openRouterChatLanguageModel(@Qualifier("openRouterWebClient") WebClient openRouterWebClient,
                                                        @Value("${openai.model:meta-llama/llama-3.3-70b-instruct:free}") String model) {
        log.info("Registering ChatLanguageModel bean for OpenRouter with model={}", model);
        return messages -> {
            List<Map<String, String>> openAiMessages = messages.stream().map(msg -> {
                Map<String, String> m = new HashMap<>();
                if (msg instanceof UserMessage) {
                    m.put("role", "user");
                    m.put("content", msg.text());
                } else if (msg instanceof SystemMessage) {
                    m.put("role", "system");
                    m.put("content", msg.text());
                } else if (msg instanceof AiMessage) {
                    m.put("role", "assistant");
                    m.put("content", msg.text());
                } else {
                    m.put("role", "user");
                    m.put("content", msg.text());
                }
                return m;
            }).toList();

            List<String> modelsToTry = new ArrayList<>();
            if (model != null && !model.isBlank()) {
                modelsToTry.add(model.trim());
            }
            // Active free models verified from OpenRouter live API
            List<String> verifiedFreeModels = List.of(
                "openrouter/free",
                "google/gemma-4-31b-it:free",
                "google/gemma-4-26b-a4b-it:free",
                "qwen/qwen3.8-27b:free",
                "nvidia/nemotron-3.5-lightning:free"
            );
            for (String freeModel : verifiedFreeModels) {
                if (!modelsToTry.contains(freeModel)) {
                    modelsToTry.add(freeModel);
                }
            }

            WebClientResponseException lastError = null;
            for (String currentModel : modelsToTry) {
                Map<String, Object> request = new HashMap<>();
                request.put("model", currentModel);
                request.put("messages", openAiMessages);

                try {
                    Map<String, Object> response = openRouterWebClient.post()
                            .header("Content-Type", "application/json")
                            .bodyValue(request)
                            .retrieve()
                            .bodyToMono(Map.class)
                            .block();

                    if (response != null) {
                        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                        if (choices != null && !choices.isEmpty()) {
                            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                            String content = (String) message.get("content");
                            if (content != null) {
                                return new dev.langchain4j.model.output.Response<>(AiMessage.from(content));
                            }
                        }
                    }
                } catch (WebClientResponseException e) {
                    lastError = e;
                    log.error("OpenRouter API error (HTTP {}) for model {}: {}", e.getStatusCode(), currentModel, e.getResponseBodyAsString());
                } catch (Exception e) {
                    log.error("Unexpected error calling OpenRouter with model {}: {}", currentModel, e.getMessage());
                }
            }

            if (lastError != null) {
                throw new RuntimeException("OpenRouter API failed (HTTP " + lastError.getStatusCode() + "): " + lastError.getResponseBodyAsString(), lastError);
            }
            throw new RuntimeException("No response received from OpenRouter across candidate models");
        };
    }
}
