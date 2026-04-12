package com.systemdesignprep.domain.model;

import java.util.Collections;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Value Object — immutable snapshot of the entire React Flow canvas.
 * Serialized as JSON for LLM consumption.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record CanvasState(
        List<SystemComponent> components,
        List<ComponentConnection> connections
) {
    public CanvasState {
        components = components != null ? List.copyOf(components) : List.of();
        connections = connections != null ? List.copyOf(connections) : List.of();
    }

    public static CanvasState empty() {
        return new CanvasState(Collections.emptyList(), Collections.emptyList());
    }

    public boolean isEmpty() {
        return components.isEmpty() && connections.isEmpty();
    }

    public int componentCount() {
        return components.size();
    }

    public int connectionCount() {
        return connections.size();
    }
}
