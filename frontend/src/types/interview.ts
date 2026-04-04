/** Shared types matching backend DTOs */

export type InterviewPhase =
  | 'INTRODUCTION'
  | 'REQUIREMENT_GATHERING'
  | 'HIGH_LEVEL_DESIGN'
  | 'DEEP_DIVE'
  | 'BOTTLENECK_ANALYSIS'
  | 'FEEDBACK_SUMMARY';

export type DifficultyLevel = 'JUNIOR' | 'MID' | 'SENIOR' | 'STAFF';

export type ComponentType =
  | 'CLIENT'
  | 'LOAD_BALANCER'
  | 'API_GATEWAY'
  | 'SERVICE'
  | 'DATABASE'
  | 'CACHE'
  | 'MESSAGE_QUEUE'
  | 'CDN'
  | 'STORAGE'
  | 'CUSTOM';

export type ConnectionType =
  | 'SYNCHRONOUS'
  | 'ASYNCHRONOUS'
  | 'EVENT_DRIVEN'
  | 'BIDIRECTIONAL';

export interface SystemComponent {
  id: string;
  type: ComponentType;
  label: string;
  description: string;
  position: { x: number; y: number };
  properties: {
    technology: string;
    scalingStrategy: string;
    notes: string;
  };
}

export interface ComponentConnection {
  id: string;
  sourceComponentId: string;
  targetComponentId: string;
  label: string;
  type: ConnectionType;
  protocol: string;
}

export interface CanvasState {
  components: SystemComponent[];
  connections: ComponentConnection[];
}

export interface InterviewSessionResponse {
  id: string;
  userId: string;
  problemTitle: string;
  difficulty: DifficultyLevel;
  currentPhase: InterviewPhase;
  canvasState: CanvasState;
  conversationHistory: ConversationTurn[];
  feedbackItems: FeedbackItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ConversationTurn {
  role: 'USER' | 'ASSISTANT';
  content: string;
  phase: InterviewPhase;
  timestamp: string;
}

export interface FeedbackItem {
  id: string;
  phase: InterviewPhase;
  category: string;
  content: string;
  targetComponentId: string | null;
  score: number;
  createdAt: string;
}
