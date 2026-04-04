-- V1__create_interview_sessions.sql
-- Initial schema for interview sessions

CREATE TABLE IF NOT EXISTS interview_sessions (
    id              UUID PRIMARY KEY,
    user_id         UUID            NOT NULL,
    problem_title   VARCHAR(200)    NOT NULL,
    problem_description TEXT,
    difficulty      VARCHAR(20)     NOT NULL,
    current_phase   VARCHAR(30)     NOT NULL,
    canvas_state    JSONB           DEFAULT '{"components":[],"connections":[]}',
    conversation_history JSONB      DEFAULT '[]',
    feedback_items  JSONB           DEFAULT '[]',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_sessions_phase ON interview_sessions(current_phase);
