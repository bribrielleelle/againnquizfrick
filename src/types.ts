export type Role = 'player' | 'teacher';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Choice {
  id: string;
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect?: boolean; // Hidden during quiz taking
}

export interface Question {
  id: string;
  quizId: string;
  prompt: string;
  choices: Choice[];
  correctChoice: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  position: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  timeLimitSeconds: number; // default 30-60s
  published: boolean;
  questionCount: number;
  iconName: string;
}

export interface AttemptAnswer {
  questionId: string;
  selectedChoice: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timedOut?: boolean;
}

export interface Attempt {
  id: string;
  userId: string;
  username: string;
  quizId: string;
  quizTitle: string;
  score: number;
  questionCount: number;
  percentage: number;
  startedAt: string;
  completedAt: string | null;
  answers: AttemptAnswer[];
}

export interface LeaderboardRank {
  rank: number;
  userId: string;
  username: string;
  completedAttempts: number;
  bestScore?: number;
  questionCount?: number;
  bestPercentage?: number;
  totalCorrectAnswers?: number;
}
