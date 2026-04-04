package com.systemdesignprep.infrastructure.web;

import com.systemdesignprep.domain.model.InterviewSession;
import com.systemdesignprep.domain.port.input.InterviewUseCase;
import com.systemdesignprep.infrastructure.web.dto.InterviewSessionResponse;
import com.systemdesignprep.infrastructure.web.dto.SendMessageRequest;
import com.systemdesignprep.infrastructure.web.dto.StartInterviewRequest;
import com.systemdesignprep.infrastructure.web.mapper.InterviewSessionDtoMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessions")
public class InterviewController {

    private final InterviewUseCase interviewUseCase;
    private final InterviewSessionDtoMapper mapper;

    public InterviewController(InterviewUseCase interviewUseCase,
                               InterviewSessionDtoMapper mapper) {
        this.interviewUseCase = interviewUseCase;
        this.mapper = mapper;
    }

    @PostMapping
    public ResponseEntity<InterviewSessionResponse> startInterview(
            @Valid @RequestBody StartInterviewRequest request) {
        InterviewSession session = interviewUseCase.startInterview(
                request.userId(), request.problemTitle(),
                request.problemDescription(), request.difficulty());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toResponse(session));
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSessionResponse> getSession(@PathVariable UUID sessionId) {
        InterviewSession session = interviewUseCase.getSession(sessionId);
        return ResponseEntity.ok(mapper.toResponse(session));
    }

    @PostMapping("/{sessionId}/advance")
    public ResponseEntity<InterviewSessionResponse> advancePhase(@PathVariable UUID sessionId) {
        InterviewSession session = interviewUseCase.advancePhase(sessionId);
        return ResponseEntity.ok(mapper.toResponse(session));
    }

    @PostMapping("/{sessionId}/message")
    public ResponseEntity<Map<String, String>> sendMessage(
            @PathVariable UUID sessionId,
            @Valid @RequestBody SendMessageRequest request) {
        String response = interviewUseCase.sendMessage(sessionId, request.message());
        return ResponseEntity.ok(Map.of("response", response));
    }
}
