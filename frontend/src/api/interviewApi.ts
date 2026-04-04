import axios from 'axios';
import type { CanvasState, InterviewSessionResponse, FeedbackItem } from '../types/interview';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

export const interviewApi = {
  start: (userId: string, problemTitle: string, problemDescription: string, difficulty: string) =>
    api.post<InterviewSessionResponse>('/sessions', {
      userId, problemTitle, problemDescription, difficulty,
    }),

  getSession: (sessionId: string) =>
    api.get<InterviewSessionResponse>(`/sessions/${sessionId}`),

  advancePhase: (sessionId: string) =>
    api.post<InterviewSessionResponse>(`/sessions/${sessionId}/advance`),

  sendMessage: (sessionId: string, message: string) =>
    api.post<{ response: string }>(`/sessions/${sessionId}/message`, { message }),

  updateCanvas: (sessionId: string, canvasState: CanvasState) =>
    api.put(`/sessions/${sessionId}/canvas`, { sessionId, canvasState }),

  analyzeCanvas: (sessionId: string) =>
    api.post<FeedbackItem[]>(`/sessions/${sessionId}/canvas/analyze`),

  reviewCode: (request: {
    code: string;
    language: string;
    problemTitle: string;
    problemDescription: string;
  }) =>
    api.post<{ review: string }>('/code/review', request),

  getHint: (request: {
    code: string;
    language: string;
    problemTitle: string;
    problemDescription: string;
    hintLevel: 'GENTLE' | 'MEDIUM' | 'DIRECT';
  }) =>
    api.post<{ hint: string }>('/code/hint', request),
};
