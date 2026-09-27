package com.systemdesignprep.infrastructure.ai;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Generates campaign challenge scenarios by prompting the configured LLM (OpenRouter / SiliconFlow)
 * via the existing LangChainAiAdapter infrastructure. Named OllamaCampaignService to reflect the
 * intended Ollama-compatible interface — swap the adapter to point at a local Ollama endpoint
 * without changing this class.
 *
 * Prompt schema contract (output must be valid JSON):
 * {
 *   "scenario": "...",
 *   "options": [
 *     {"text": "...", "scoreImpact": 15,   "type": "LEAD"},
 *     {"text": "...", "scoreImpact": -10,  "type": "AVERAGE"},
 *     {"text": "...", "scoreImpact": -100, "type": "OUTAGE"}
 *   ]
 * }
 */
@Service
public class OllamaCampaignService {

    private static final Logger log = LoggerFactory.getLogger(OllamaCampaignService.class);

    // ── Prompt template ─────────────────────────────────────────────────────
    private static final String SYSTEM_PROMPT_TEMPLATE = """
            You are an elite technical interviewer designing a senior-level engineering challenge for a \
            10-year Lead Engineer candidate applying to a top-tier FAANG-adjacent company.

            Region: %d — %s
            Focus area: %s

            Requirements for the challenge:
            - The SCENARIO must be a realistic production crisis, architectural trade-off, or leadership \
            decision a Staff/Lead Engineer would face in their first 6 months on the job.
            - Reference concrete technologies: Java 17, Spring Boot 3, Kafka, Redis, PostgreSQL, AWS, or \
            LangChain4j / MCP Servers where relevant to the focus area.
            - The THREE options must be clearly distinguishable:
              * LEAD   (+15)  — demonstrates senior instinct, proactive ownership, and system-level thinking
              * AVERAGE (-10) — textbook or junior response; technically correct but misses the leadership signal
              * OUTAGE (-100) — an anti-pattern, unsafe shortcut, or decision that cascades into a production incident
            - Each option must be 1–2 sentences, specific, and actionable.
            - SCENARIO must be 3–5 sentences describing the crisis with enough context to answer.

            Output ONLY valid JSON. No markdown, no code fences, no explanation. Match this exact schema:
            {
              "scenario": "Detailed architectural or behavioral crisis...",
              "options": [
                {"text": "High-signal Lead architecture/leadership action...", "scoreImpact": 15, "type": "LEAD"},
                {"text": "Mediocre/textbook response...", "scoreImpact": -10, "type": "AVERAGE"},
                {"text": "Anti-pattern or unsafe production choice...", "scoreImpact": -100, "type": "OUTAGE"}
              ]
            }
            """;

    // ── Shared value types used by CampaignService ───────────────────────────
    public record AnswerOption(String text, int scoreImpact, String type) {}
    public record ChallengeData(String scenario, List<AnswerOption> options) {}

    private final LangChainAiAdapter aiAdapter;
    private final ObjectMapper objectMapper;

    public OllamaCampaignService(LangChainAiAdapter aiAdapter, ObjectMapper objectMapper) {
        this.aiAdapter = aiAdapter;
        this.objectMapper = objectMapper;
    }

    /**
     * Asks the LLM to generate a challenge for the given region.
     * Returns {@code null} if generation or JSON parsing fails — the caller must fall back
     * to the static question bank.
     */
    public ChallengeData generateChallenge(int regionId, String regionName, String focusArea) {
        String prompt = String.format(SYSTEM_PROMPT_TEMPLATE, regionId, regionName, focusArea);
        try {
            String raw = aiAdapter.generateRawResponse(prompt, "campaign-system");
            String json = extractJsonObject(raw);
            JsonNode root = objectMapper.readTree(json);

            String scenario = root.path("scenario").asText();
            if (scenario.isBlank()) throw new IllegalStateException("Empty scenario in AI response");

            List<AnswerOption> options = objectMapper.convertValue(
                    root.path("options"),
                    new TypeReference<List<AnswerOption>>() {}
            );
            if (options == null || options.size() < 3) {
                throw new IllegalStateException("Expected 3 options, got: " + (options == null ? 0 : options.size()));
            }
            log.debug("AI challenge generated for region {}", regionId);
            return new ChallengeData(scenario, options);

        } catch (Exception e) {
            log.warn("AI challenge generation failed for region {} — will use static bank. Reason: {}", regionId, e.getMessage());
            return null;
        }
    }

    // ── Utility ─────────────────────────────────────────────────────────────

    /**
     * Strips markdown code fences and extracts the outermost JSON object from a raw LLM response.
     */
    private static String extractJsonObject(String raw) {
        String s = raw.strip();
        // Remove ```json ... ``` or ``` ... ```
        if (s.startsWith("```")) {
            int firstNl = s.indexOf('\n');
            int lastFence = s.lastIndexOf("```");
            if (firstNl > 0 && lastFence > firstNl) {
                s = s.substring(firstNl + 1, lastFence).strip();
            }
        }
        // Find the first '{' and last '}'
        int start = s.indexOf('{');
        int end = s.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return s.substring(start, end + 1);
        }
        return s;
    }
}
