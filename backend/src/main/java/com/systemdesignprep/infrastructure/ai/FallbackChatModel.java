package com.systemdesignprep.infrastructure.ai;

import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.output.Response;
import dev.langchain4j.data.message.AiMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * A {@link ChatLanguageModel} decorator that walks a chain of providers in order,
 * falling back to the next one whenever the current provider is out of quota or credits.
 *
 * Chain order (configured in AiConfig): Gemini → Claude → Ollama
 *
 * Signals that trigger a fallback:
 *  - HTTP 429 / RESOURCE_EXHAUSTED  (rate limit / quota)
 *  - "credit balance is too low"    (Anthropic billing)
 *  - "billing"                      (generic billing error)
 *  - "insufficient_quota"           (OpenAI-style)
 *  - "overloaded"                   (provider capacity)
 */
public class FallbackChatModel implements ChatLanguageModel {

    private static final Logger log = LoggerFactory.getLogger(FallbackChatModel.class);

    private static final String[] QUOTA_SIGNALS = {
            "429",
            "resource_exhausted",
            "quota",
            "overloaded",
            "credit balance",
            "credit balance is too low",
            "too low",
            "billing",
            "insufficient_quota",
            "rate_limit_exceeded",
            "insufficient credits"
    };

    public record NamedModel(String name, ChatLanguageModel model) {}

    private final List<NamedModel> chain;

    public FallbackChatModel(List<NamedModel> chain) {
        if (chain == null || chain.isEmpty()) {
            throw new IllegalArgumentException("Provider chain must not be empty");
        }
        this.chain = List.copyOf(chain);
    }

    @Override
    public Response<AiMessage> generate(List<ChatMessage> messages) {
        RuntimeException lastException = null;
        for (int i = 0; i < chain.size(); i++) {
            NamedModel current = chain.get(i);
            try {
                return current.model().generate(messages);
            } catch (RuntimeException ex) {
                if (isQuotaOrBillingError(ex)) {
                    lastException = ex;
                    if (i < chain.size() - 1) {
                        log.warn("[AI-Fallback] {} is unavailable (quota/billing) — switching to {}. Cause: {}",
                                current.name(), chain.get(i + 1).name(), rootMessage(ex));
                    } else {
                        log.error("[AI-Fallback] All {} provider(s) exhausted. Last error: {}",
                                chain.size(), rootMessage(ex));
                    }
                } else {
                    throw ex;
                }
            }
        }
        throw lastException;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private static boolean isQuotaOrBillingError(RuntimeException ex) {
        String combined = messageChain(ex).toLowerCase();
        for (String signal : QUOTA_SIGNALS) {
            if (combined.contains(signal)) {
                return true;
            }
        }
        return false;
    }

    /** Walks the cause chain and concatenates all messages. */
    private static String messageChain(Throwable t) {
        StringBuilder sb = new StringBuilder();
        while (t != null) {
            if (t.getMessage() != null) {
                sb.append(t.getMessage()).append(' ');
            }
            t = t.getCause();
        }
        return sb.toString();
    }

    private static String rootMessage(Throwable t) {
        String msg = t.getMessage();
        while (t.getCause() != null) {
            t = t.getCause();
            if (t.getMessage() != null) msg = t.getMessage();
        }
        return msg;
    }
}
