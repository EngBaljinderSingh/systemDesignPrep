import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export interface WorkExperiencePayload {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationEntryPayload {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface CreateResumePayload {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  github: string;
  website: string;
  country: string;
  pages: number;
  summary: string;
  oldResume: string;
  workExperience: WorkExperiencePayload[];
  education: EducationEntryPayload[];
  skills: string[];
  certifications: string[];
  languages: string[];
}

export interface UpdateResumePayload {
  existingResume: string;
  selectedSkills: string[];
  jobDescription: string;
  pages: number;
}

export const resumeApi = {
  createResume: (data: CreateResumePayload) =>
    api.post<{ resume: string }>('/resume/create', data),

  analyzeJobDescription: (jobDescription: string) =>
    api.post<{ skills: string[] }>('/resume/analyze-jd', { jobDescription }),

  updateResume: (data: UpdateResumePayload) =>
    api.post<{ resume: string }>('/resume/update', data),
};
