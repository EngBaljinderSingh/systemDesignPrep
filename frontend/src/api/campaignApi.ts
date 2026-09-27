import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? 'https://systemdesignprep.onrender.com/api' : '/api');

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

export interface ChallengeOption {
  index: number;
  text: string;
}

export interface ChallengeResponse {
  challengeId: string;
  regionId: number;
  regionName: string;
  bossName: string;
  scenario: string;
  options: ChallengeOption[];
}

export interface SubmitAnswerResponse {
  choiceType: 'LEAD' | 'AVERAGE' | 'OUTAGE';
  scoreImpact: number;
  feedback: string;
  unlockedNextRegion: boolean;
  gameOver: boolean;
}

export const campaignApi = {
  getChallenge: (regionId: number) =>
    api.get<ChallengeResponse>(`/campaign/region/${regionId}/challenge`),

  submitAnswer: (challengeId: string, regionId: number, choiceIndex: number) =>
    api.post<SubmitAnswerResponse>('/campaign/region/submit', {
      challengeId,
      regionId,
      choiceIndex,
    }),
};
