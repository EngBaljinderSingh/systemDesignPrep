package com.systemdesignprep.domain.model;

/**
 * Value Object — represents a directed edge between two SystemComponents.
 * Maps to a React Flow edge.
 */
public record ComponentConnection(
        String id,
        String sourceComponentId,
        String targetComponentId,
        String label,
        ConnectionType type,
        String protocol
) {
    public enum ConnectionType {
        SYNCHRONOUS,
        ASYNCHRONOUS,
        EVENT_DRIVEN,
        BIDIRECTIONAL
    }
}
