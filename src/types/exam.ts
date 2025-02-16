export interface ExamResult {
  userId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: Record<number, string>;
  completedAt: string;
  attemptCount: number;
} 