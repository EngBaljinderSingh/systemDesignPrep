package com.systemdesignprep.domain.model;

/**
 * Finite State Machine phases for the mock interview.
 * Transitions are enforced by the domain — not the controller layer.
 */
public enum InterviewPhase {
    INTRODUCTION,
    REQUIREMENT_GATHERING,
    HIGH_LEVEL_DESIGN,
    DEEP_DIVE,
    BOTTLENECK_ANALYSIS,
    FEEDBACK_SUMMARY;

    public InterviewPhase next() {
        int nextOrdinal = this.ordinal() + 1;
        InterviewPhase[] phases = values();
        if (nextOrdinal >= phases.length) {
            throw new IllegalStateException("Cannot advance beyond " + this.name());
        }
        return phases[nextOrdinal];
    }

    public boolean canAdvanceTo(InterviewPhase target) {
        return target.ordinal() == this.ordinal() + 1;
    }

    public boolean isTerminal() {
        return this == FEEDBACK_SUMMARY;
    }
}
