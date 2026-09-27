package com.systemdesignprep.infrastructure.web.dto;

/**
 * Returned after a player submits their answer to a challenge.
 */
public record SubmitAnswerResponse(
        String choiceType,       // LEAD | AVERAGE | OUTAGE
        int scoreImpact,         // +15 | -10 | -100
        String feedback,
        boolean unlockedNextRegion,
        boolean gameOver
) {}
