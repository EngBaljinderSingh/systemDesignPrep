package com.systemdesignprep.infrastructure.ai;

import com.systemdesignprep.domain.model.CanvasState;
import com.systemdesignprep.domain.model.ConversationTurn;
import com.systemdesignprep.domain.model.InterviewPhase;
import com.systemdesignprep.domain.port.output.AiGateway;
import dev.langchain4j.model.chat.ChatLanguageModel;
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

    private final ChatLanguageModel chatModel;
    private final ObjectMapper objectMapper;

    public LangChainAiAdapter(ChatLanguageModel chatModel, ObjectMapper objectMapper) {
        this.chatModel = chatModel;
        this.objectMapper = objectMapper;
    }

    @Override
    public String generateInterviewResponse(InterviewPhase phase, List<ConversationTurn> history,
                                            CanvasState canvasState, String userMessage) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(SystemMessage.from(buildSystemPrompt(phase, canvasState)));

        for (ConversationTurn turn : history) {
            switch (turn.role()) {
                case USER -> messages.add(UserMessage.from(turn.content()));
                case ASSISTANT -> messages.add(AiMessage.from(turn.content()));
            }
        }
        messages.add(UserMessage.from(userMessage));

        log.debug("Sending {} messages to LLM for phase={}", messages.size(), phase);
        return chatModel.generate(messages).content().text();
    }

    @Override
    public String analyzeArchitecture(CanvasState canvasState, InterviewPhase phase) {
        String canvasJson = serializeCanvas(canvasState);
        String prompt = """
                You are a senior system design interviewer. Analyze the following architecture diagram \
                (represented as JSON) and provide feedback on scalability, reliability, and potential bottlenecks.
                
                Current interview phase: %s
                
                Architecture JSON:
                ```json
                %s
                ```
                
                Provide structured feedback with:
                1. Strengths of the current design
                2. Potential bottlenecks or single points of failure
                3. Specific improvement suggestions
                4. A score from 1-10 for the current design quality
                """.formatted(phase, canvasJson);

        return chatModel.generate(prompt);
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
