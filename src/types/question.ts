export interface Question {
    id: number
    text: string
    options: {
      id: string
      text: string
    }[]
    correctAnswer?: string
  }
  
  export interface QuizState {
    currentQuestionId: number
    answers: Record<number, string>
    timeRemaining: number
    isSubmitted: boolean
    questions: Question[]
    loading: boolean
    error: string | null
    score?: number
    correctAnswers?: number
    hasCompletedExam: boolean
    examResult: {
      score: number;
      correctAnswers: number;
      attemptCount: number;
      duration: number;
    } | null;
    attemptCount: number;
  }