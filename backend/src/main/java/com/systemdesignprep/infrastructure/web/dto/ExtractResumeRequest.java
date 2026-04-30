package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.NotBlank;

public record ExtractResumeRequest(
        @NotBlank(message = "resumeText must not be blank")
        String resumeText
) {}
