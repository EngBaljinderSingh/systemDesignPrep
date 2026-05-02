package com.systemdesignprep.infrastructure.ai;

import com.systemdesignprep.domain.model.CanvasState;
import com.systemdesignprep.domain.model.ConversationTurn;
import com.systemdesignprep.domain.model.InterviewPhase;
import com.systemdesignprep.domain.port.output.AiGateway;
import dev.langchain4j.model.chat.ChatLanguageModel;
import com.systemdesignprep.infrastructure.service.RateLimiterService;
import com.systemdesignprep.domain.model.ConversationTurn.Role;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Driven Adapter — wraps LangChain4j ChatLanguageModel.
 * The domain never knows about LangChain4j; it only speaks through AiGateway.
 */
@Component
public class LangChainAiAdapter implements AiGateway {

    private static final Logger log = LoggerFactory.getLogger(LangChainAiAdapter.class);


    private final ChatLanguageModel openRouterModel;
    private final ChatLanguageModel siliconFlowModel;
    private final ObjectMapper objectMapper;
    private final ModelRouterService modelRouterService;
    private final RateLimiterService rateLimiterService;
    private final TokenCounter tokenCounter;
    private final ConversationUtils conversationUtils;
    private final SemanticCache semanticCache;

    public LangChainAiAdapter(
            ChatLanguageModel openRouterModel,
            ChatLanguageModel siliconFlowModel,
            ObjectMapper objectMapper,
            ModelRouterService modelRouterService,
            RateLimiterService rateLimiterService,
            TokenCounter tokenCounter,
            ConversationUtils conversationUtils,
            SemanticCache semanticCache
    ) {
        this.openRouterModel = openRouterModel;
        this.siliconFlowModel = siliconFlowModel;
        this.objectMapper = objectMapper;
        this.modelRouterService = modelRouterService;
        this.rateLimiterService = rateLimiterService;
        this.tokenCounter = tokenCounter;
        this.conversationUtils = conversationUtils;
        this.semanticCache = semanticCache;
    }

    @Override
    public String generateInterviewResponse(InterviewPhase phase, List<ConversationTurn> history,
                                            CanvasState canvasState, String userMessage) {
        // For backwards compatibility, use "anonymous" as userId
        return generateInterviewResponse(phase, history, canvasState, userMessage, "anonymous");
    }

    // Actual implementation with userId
    public String generateInterviewResponse(InterviewPhase phase, List<ConversationTurn> history,
                                            CanvasState canvasState, String userMessage, String userId) {
        // 1. Rate limit check
        if (!rateLimiterService.tryConsume(userId)) {
            return "You have exceeded the rate limit. Please wait and try again.";
        }

        // 2. Truncate history for cost (keep recent turns within token budget)
        List<ConversationTurn> truncated = conversationUtils.truncateTurns(history, tokenCounter);

        // 3. Build cache key from system prompt + last user message
        String systemPrompt = buildSystemPrompt(phase, canvasState);
        String cacheKey = systemPrompt + "\n" + userMessage;

        // 4. Semantic cache lookup
        var cached = semanticCache.getCachedResponse(cacheKey);
        if (cached.isPresent()) {
            log.info("Semantic cache hit for phase={}", phase);
            return cached.get();
        }

        // 5. Model routing
        int tokenCount = tokenCounter.countTokens(cacheKey);
        String modelName = modelRouterService.routeModel(cacheKey, tokenCount);
        ChatLanguageModel model = modelName.contains("silicon") ? siliconFlowModel : openRouterModel;

        // 6. Build messages with correct roles
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(SystemMessage.from(systemPrompt));
        for (ConversationTurn turn : truncated) {
            if (turn.role() == Role.USER) {
                messages.add(UserMessage.from(turn.content()));
            } else {
                messages.add(AiMessage.from(turn.content()));
            }
        }
        messages.add(UserMessage.from(userMessage));

        log.debug("Sending {} messages to LLM for phase={} using model {}", messages.size(), phase, modelName);
        String response = model.generate(messages).content().text();

        // 7. Cache response
        semanticCache.cacheResponse(cacheKey, response);

        return response;
    }

    /**
     * Used by controllers for simple prompt/response (code review, resume, etc)
     */
    public String generateRawResponse(String prompt, String userId) {
        // 1. Rate limit check
        if (!rateLimiterService.tryConsume(userId)) {
            return "You have exceeded the rate limit. Please wait and try again.";
        }

        // 2. Semantic cache lookup
        var cached = semanticCache.getCachedResponse(prompt);
        if (cached.isPresent()) {
            log.info("Cache hit for prompt");
            return cached.get();
        }

        // 3. Model routing
        int tokenCount = tokenCounter.countTokens(prompt);
        String modelName = modelRouterService.routeModel(prompt, tokenCount);
        ChatLanguageModel model = modelName.contains("silicon") ? siliconFlowModel : openRouterModel;

        // 4. LLM call
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(UserMessage.from(prompt));
        log.debug("Sending 1 message to LLM using model {}", modelName);
        String response = model.generate(messages).content().text();

        // 5. Cache response
        semanticCache.cacheResponse(prompt, response);
        return response;
    }

    @Override
    public String analyzeArchitecture(CanvasState canvasState, InterviewPhase phase) {
        // Simple implementation: describe the architecture in the given phase
        String prompt = "Analyze the following system architecture for the " + phase + " phase:\n" + serializeCanvas(canvasState);
        return generateRawResponse(prompt, "anonymous");
    }

    private String buildSystemPrompt(InterviewPhase phase, CanvasState canvasState) {
        String canvasContext = canvasState.isEmpty()
                ? "The candidate has not drawn any architecture yet."
                : "Current architecture: " + serializeCanvas(canvasState);

        return """
                You are an expert system design interviewer conducting a mock interview. \
                You are currently in the %s phase.
                
                Interview Phase Guidelines:
                - INTRODUCTION: Greet the candidate, present the problem, set expectations.
                - REQUIREMENT_GATHERING: Ask clarifying questions about functional/non-functional requirements, \
                  scale, constraints. Do NOT let the candidate skip this phase.
                - HIGH_LEVEL_DESIGN: Guide the candidate to sketch a high-level architecture. \
                  Ask about major components, data flow, API design.
                - DEEP_DIVE: Pick 1-2 components and drill deep — database schema, caching strategy, \
                  consistency model, failure handling.
                - BOTTLENECK_ANALYSIS: Challenge the design — what breaks at 10x scale? \
                  Single points of failure? Data consistency issues?
                - FEEDBACK_SUMMARY: Summarize strengths, weaknesses, and an overall score.
                
                %s
                
                Be concise, Socratic, and challenging. Ask one question at a time. \
                Do not give away answers — guide the candidate to discover them.
                """.formatted(phase, canvasContext);
    }

    private String serializeCanvas(CanvasState canvasState) {
        try {
            return objectMapper.writeValueAsString(canvasState);
        } catch (Exception e) {
            log.error("Failed to serialize canvas state", e);
            return "{}";
        }
    }
}
