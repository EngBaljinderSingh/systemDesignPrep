package com.systemdesignprep.domain.model;

/**
 * Value Object — represents a single component (node) on the design canvas.
 * This is the Java-side representation of a React Flow node.
 */
public record SystemComponent(
        String id,
        ComponentType type,
        String label,
        String description,
        Position position,
        ComponentProperties properties
) {
    public record Position(double x, double y) {}

    public record ComponentProperties(
            String technology,
            String scalingStrategy,
            String notes
    ) {}

    public enum ComponentType {
        CLIENT,
        LOAD_BALANCER,
        API_GATEWAY,
        SERVICE,
        DATABASE,
        CACHE,
        MESSAGE_QUEUE,
        CDN,
        STORAGE,
        CUSTOM
    }
}
