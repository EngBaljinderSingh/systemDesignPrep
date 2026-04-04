package com.systemdesignprep.infrastructure.web;

import com.systemdesignprep.infrastructure.ai.LangChainAiAdapter;
import com.systemdesignprep.infrastructure.web.dto.CodeHintRequest;
import com.systemdesignprep.infrastructure.web.dto.CodeHintRequest.HintLevel;
import com.systemdesignprep.infrastructure.web.dto.CodeReviewRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/code")
public class CodeController {

    private final LangChainAiAdapter ai;

    public CodeController(LangChainAiAdapter ai) {
        this.ai = ai;
    }

    @PostMapping("/review")
    public ResponseEntity<Map<String, String>> reviewCode(@Valid @RequestBody CodeReviewRequest req) {
        String prompt = buildReviewPrompt(req);
        String review = ai.generateRawResponse(prompt);
        return ResponseEntity.ok(Map.of("review", review));
    }

    @PostMapping("/hint")
    public ResponseEntity<Map<String, String>> getHint(@Valid @RequestBody CodeHintRequest req) {
        String prompt = buildHintPrompt(req);
        String hint = ai.generateRawResponse(prompt);
        return ResponseEntity.ok(Map.of("hint", hint));
    }

    // ── Prompt builders ──

    private static String buildReviewPrompt(CodeReviewRequest req) {
        return """
                You are an expert software engineer and coding interview coach. \
                Review the following %s solution for the problem "%s".

                Problem description:
                %s

                Submitted code:
                ```%s
                %s
                ```

                Provide a detailed code review covering:
                1. **Correctness** — Does the solution handle all edge cases?
                2. **Time & Space Complexity** — State the Big-O and whether it can be improved.
                3. **Code Quality** — Readability, naming, structure, idiomatic use of the language.
                4. **Bugs or Improvements** — List specific issues with line references or suggestions.
                5. **Optimized Approach** — If a better approach exists, describe it (do NOT write the full solution).

                Be constructive and specific.
                """.formatted(
                req.language(), req.problemTitle(),
                req.problemDescription() == null ? "(not provided)" : req.problemDescription(),
                req.language(), req.code()
        );
    }

    private static String buildHintPrompt(CodeHintRequest req) {
        String hintStyle = switch (req.hintLevel()) {
            case GENTLE -> """
                    Give a very subtle hint. Just point in the right direction — \
                    mention the general technique or data structure to think about. \
                    Do NOT reveal the algorithm or code.""";
            case MEDIUM -> """
                    Give a medium hint. Explain the key insight or the algorithm pattern to use. \
                    You can describe the high-level approach but do NOT write any code.""";
            case DIRECT -> """
                    Give a direct hint. Describe the full approach step by step including \
                    the data structures and algorithm. You may show pseudocode but NOT the full solution code.""";
        };

        String codeSection = req.code().isBlank()
                ? "(no code written yet)"
                : "Current code:\n```%s\n%s\n```".formatted(req.language(), req.code());

        return """
                You are a helpful coding interview coach. The developer is working on the following problem.

                Problem: %s
                Description: %s

                %s

                %s

                Keep the hint concise and focused.
                """.formatted(
                req.problemTitle(),
                req.problemDescription() == null ? "(not provided)" : req.problemDescription(),
                codeSection,
                hintStyle
        );
    }
}
