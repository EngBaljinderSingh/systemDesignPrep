package com.systemdesignprep.infrastructure.web;

import com.systemdesignprep.domain.model.Feedback;
import com.systemdesignprep.domain.port.input.CanvasUseCase;
import com.systemdesignprep.infrastructure.web.dto.InterviewSessionResponse;
import com.systemdesignprep.infrastructure.web.dto.UpdateCanvasRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
public class CanvasController {

    private final CanvasUseCase canvasUseCase;

    public CanvasController(CanvasUseCase canvasUseCase) {
        this.canvasUseCase = canvasUseCase;
    }

    @PutMapping("/{sessionId}/canvas")
    public ResponseEntity<Void> updateCanvas(
            @PathVariable UUID sessionId,
            @Valid @RequestBody UpdateCanvasRequest request) {
        canvasUseCase.updateCanvas(sessionId, request.canvasState());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{sessionId}/canvas/analyze")
    public ResponseEntity<List<InterviewSessionResponse.FeedbackDto>> analyzeCanvas(
            @PathVariable UUID sessionId) {
        List<Feedback> feedback = canvasUseCase.analyzeCanvas(sessionId);
        List<InterviewSessionResponse.FeedbackDto> dtos = feedback.stream()
                .map(f -> new InterviewSessionResponse.FeedbackDto(
                        f.id(), f.phase(), f.category(), f.content(),
                        f.targetComponentId(), f.score(), f.createdAt()))
                .toList();
        return ResponseEntity.ok(dtos);
    }
}
