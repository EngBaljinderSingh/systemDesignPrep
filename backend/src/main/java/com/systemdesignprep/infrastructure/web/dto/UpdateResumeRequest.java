package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record UpdateResumeRequest(
        @NotBlank String existingResume,
        @NotNull List<String> selectedSkills,
        String jobDescription,
        @Min(1) @Max(3) int pages
) {}
