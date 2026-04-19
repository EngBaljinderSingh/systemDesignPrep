package com.systemdesignprep.infrastructure.web.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record CreateResumeRequest(
        String fullName,
        String email,
        String phone,
        String linkedIn,
        String github,
        String website,
        @NotBlank String country,
        @Min(1) @Max(3) int pages,
        String summary,
        String oldResume,
        List<WorkExperience> workExperience,
        List<EducationEntry> education,
        List<String> skills,
        List<String> certifications,
        List<String> languages
) {
    public record WorkExperience(
            String company,
            String role,
            String location,
            String startDate,
            String endDate,
            boolean current,
            String description
    ) {}

    public record EducationEntry(
            String institution,
            String degree,
            String field,
            String location,
            String startDate,
            String endDate,
            String gpa
    ) {}
}
