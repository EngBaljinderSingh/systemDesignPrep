package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CodeReviewRequest(
        @NotBlank String code,
        @NotBlank String language,
        @NotBlank String problemTitle,
        String problemDescription
) {}
