import { Timestamp } from 'firebase/firestore';

export interface ExamResult {
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: Record<number, string>;
  completedAt: Timestamp;
  attemptCount: number;
} 