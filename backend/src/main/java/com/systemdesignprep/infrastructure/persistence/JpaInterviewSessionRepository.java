package com.systemdesignprep.infrastructure.persistence;

import com.systemdesignprep.infrastructure.persistence.entity.InterviewSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JpaInterviewSessionRepository extends JpaRepository<InterviewSessionEntity, UUID> {
}
