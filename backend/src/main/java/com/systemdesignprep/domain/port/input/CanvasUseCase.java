package com.systemdesignprep.domain.port.input;

import com.systemdesignprep.domain.model.CanvasState;
import com.systemdesignprep.domain.model.Feedback;

import java.util.List;
import java.util.UUID;

/**
 * Input Port — driving side for canvas-related operations.
 */
public interface CanvasUseCase {

    void updateCanvas(UUID sessionId, CanvasState canvasState);

    List<Feedback> analyzeCanvas(UUID sessionId);
}
