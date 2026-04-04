package com.systemdesignprep.domain.port.output;

import com.systemdesignprep.domain.model.CanvasState;
import com.systemdesignprep.domain.model.ConversationTurn;
import com.systemdesignprep.domain.model.InterviewPhase;

import java.util.List;

/**
 * Output Port — driven side for AI/LLM interactions.
 * Abstracts away the specific LLM provider (Gemini, Claude, etc.).
 */
public interface AiGateway {

    String generateInterviewResponse(InterviewPhase phase, List<ConversationTurn> history,
                                     CanvasState canvasState, String userMessage);

    String analyzeArchitecture(CanvasState canvasState, InterviewPhase phase);
}
