

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
import org.springframework.context.annotation.Primary;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Configuration
public class AiConfig {
    private static final Logger log = LoggerFactory.getLogger(AiConfig.class);

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.base-url}")
    private String apiUrl;



    @Bean
    public WebClient siliconFlowWebClient(
            @Value("${siliconflow.api-key}") String siliconApiKey,
            @Value("${siliconflow.base-url}") String siliconApiUrl) {
        log.info("Creating SiliconFlow WebClient with baseUrl={} and apiKey present={}", siliconApiUrl, siliconApiKey != null && !siliconApiKey.isEmpty());
        return WebClient.builder()
                .baseUrl(siliconApiUrl)
                .defaultHeader("Authorization", "Bearer " + siliconApiKey)
                .build();
    }

    @Bean
    public ChatLanguageModel siliconFlowChatLanguageModel(WebClient siliconFlowWebClient,
                                                        @Value("${siliconflow.model}") String model) {
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
                }
                return m;
            }).toList();
            request.put("messages", openAiMessages);

            Map<String, Object> response = siliconFlowWebClient.post()
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
        log.info("Creating OpenRouter WebClient with baseUrl={} and apiKey present={}", apiUrl, apiKey != null && !apiKey.isEmpty());
        return WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    @Bean
    @Primary
    @SuppressWarnings({"unchecked", "rawtypes"})
    public ChatLanguageModel openRouterChatLanguageModel(WebClient openRouterWebClient,
                                                        @Value("${openai.model}") String model) {
        log.info("Registering ChatLanguageModel bean for OpenRouter with model={}", model);
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
                }
                return m;
            }).toList();
            request.put("messages", openAiMessages);

            Map<String, Object> response = openRouterWebClient.post()
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("No choices returned from OpenRouter");
            }
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");
            return new dev.langchain4j.model.output.Response<>(AiMessage.from(content));
        };
    }
}
