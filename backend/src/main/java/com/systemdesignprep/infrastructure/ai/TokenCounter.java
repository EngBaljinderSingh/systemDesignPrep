package com.systemdesignprep.infrastructure.ai;

import org.springframework.stereotype.Component;

@Component
public class TokenCounter {
    // Simple token counter: 1 token ≈ 4 chars (for English)
    public int countTokens(String text) {
        if (text == null) return 0;
        return Math.max(1, text.length() / 4);
    }
}
