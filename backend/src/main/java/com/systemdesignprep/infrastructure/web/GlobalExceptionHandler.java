package com.systemdesignprep.infrastructure.web;

import com.systemdesignprep.application.service.SessionNotFoundException;
import com.systemdesignprep.infrastructure.web.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(SessionNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleSessionNotFound(
            SessionNotFoundException ex, HttpServletRequest request) {
        log.warn("Session not found: {}", ex.getSessionId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiErrorResponse.of(404, "Not Found", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalState(
            IllegalStateException ex, HttpServletRequest request) {
        log.warn("Illegal state: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiErrorResponse.of(409, "Conflict", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.of(400, "Bad Request", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ApiErrorResponse.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> new ApiErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiErrorResponse.withFieldErrors(400, "Validation Failed",
                        "Request validation failed", request.getRequestURI(), fieldErrors));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntime(
            RuntimeException ex, HttpServletRequest request) {
        String msg = ex.getMessage() != null ? ex.getMessage() : "";
        // Nested cause message (e.g. AnthropicHttpException wrapped in RuntimeException)
        String causeMsg = ex.getCause() != null && ex.getCause().getMessage() != null
                ? ex.getCause().getMessage() : "";
        String combined = msg + " " + causeMsg;

        if (combined.contains("429") || combined.contains("RESOURCE_EXHAUSTED") || combined.contains("quota")) {
            log.warn("AI quota exceeded on {}: {}", request.getRequestURI(), msg);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(ApiErrorResponse.of(429, "AI Quota Exceeded",
                            "The AI provider's free quota is exhausted. Add billing to the project or get a fresh API key.",
                            request.getRequestURI()));
        }
        if (combined.contains("credit balance") || combined.contains("billing") || combined.contains("too low")) {
            log.warn("AI billing error on {}: {}", request.getRequestURI(), msg);
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                    .body(ApiErrorResponse.of(402, "AI Credits Exhausted",
                            "The AI provider account has insufficient credits. Please top up your Anthropic/Gemini account or switch API keys.",
                            request.getRequestURI()));
        }
        if (combined.contains("401") || combined.contains("UNAUTHORIZED") || combined.contains("API key not valid")
                || combined.contains("invalid_api_key")) {
            log.warn("AI auth error on {}: {}", request.getRequestURI(), msg);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiErrorResponse.of(401, "AI Auth Failed",
                            "The AI API key is invalid or expired. Update your GEMINI_API_KEY or CLAUDE_API_KEY in .env.",
                            request.getRequestURI()));
        }
        log.error("Unhandled runtime exception on {}: {}", request.getRequestURI(), msg, ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of(500, "Internal Server Error",
                        "An unexpected error occurred", request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception on {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiErrorResponse.of(500, "Internal Server Error",
                        "An unexpected error occurred", request.getRequestURI()));
    }
}
