package com.systemdesignprep.infrastructure.web.dto;

import com.systemdesignprep.domain.model.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record StartInterviewRequest(
        @NotNull UUID userId,
        @NotBlank @Size(max = 200) String problemTitle,
        @NotBlank @Size(max = 2000) String problemDescription,
        @NotNull DifficultyLevel difficulty
) {}
