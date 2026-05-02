package com.systemdesignprep.infrastructure.ai;

import com.systemdesignprep.domain.model.ConversationTurn;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.ArrayList;

@Component
public class ConversationUtils {
    private static final int MAX_HISTORY_TOKENS = 1024;

    /**
     * Truncate typed ConversationTurns to fit within token limit (preserves roles).
     */
    public List<ConversationTurn> truncateTurns(List<ConversationTurn> history, TokenCounter tokenCounter) {
        List<ConversationTurn> result = new ArrayList<>();
        int totalTokens = 0;
        for (int i = history.size() - 1; i >= 0; i--) {
            ConversationTurn turn = history.get(i);
            int tokens = tokenCounter.countTokens(turn.content());
            if (totalTokens + tokens > MAX_HISTORY_TOKENS) break;
            result.add(0, turn);
            totalTokens += tokens;
        }
        return result;
    }

    /**
     * Truncate plain-string history to fit within token limit (legacy).
     */
    public List<String> truncateHistory(List<String> history, TokenCounter tokenCounter) {
        List<String> result = new ArrayList<>();
        int totalTokens = 0;
        for (int i = history.size() - 1; i >= 0; i--) {
            String msg = history.get(i);
            int tokens = tokenCounter.countTokens(msg);
            if (totalTokens + tokens > MAX_HISTORY_TOKENS) break;
            result.add(0, msg);
            totalTokens += tokens;
        }
        return result;
    }
}
