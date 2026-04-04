package com.systemdesignprep.infrastructure.web.dto;

import com.systemdesignprep.domain.model.CanvasState;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UpdateCanvasRequest(
        @NotNull UUID sessionId,
        @NotNull CanvasState canvasState
) {}
