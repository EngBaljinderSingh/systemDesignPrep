package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;

public record AnalyzeJobDescriptionRequest(
        @NotBlank String jobDescription
) {}
