package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmitAnswerRequest(
        @NotBlank String challengeId,
        @NotNull @Min(1) @Max(5) Integer regionId,
        @NotNull @Min(0) @Max(2) Integer choiceIndex
) {}
