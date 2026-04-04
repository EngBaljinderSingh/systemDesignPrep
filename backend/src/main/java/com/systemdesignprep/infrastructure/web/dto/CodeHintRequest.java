package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CodeHintRequest(
        @NotBlank String code,
        @NotBlank String language,
        @NotBlank String problemTitle,
        String problemDescription,
        @NotNull HintLevel hintLevel
) {
    public enum HintLevel { GENTLE, MEDIUM, DIRECT }
}
