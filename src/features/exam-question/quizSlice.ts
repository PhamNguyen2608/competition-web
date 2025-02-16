import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Question, QuizState } from "../../types/question"

const initialState: QuizState = {
  currentQuestionId: 1,
  answers: {},
  timeRemaining: 45 * 60, // 45 minutes in seconds (based on EXAM_RULES)
  isSubmitted: false,
  questions: [],
  loading: true,
  error: null,
  hasCompletedExam: false,
  examResult: null,
  attemptCount: 0,
}

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    setCurrentQuestion: (state, action: PayloadAction<number>) => {
      state.currentQuestionId = action.payload
    },
    setAnswer: (state, action: PayloadAction<{ questionId: number; answerId: string }>) => {
      const { questionId, answerId } = action.payload
      state.answers[questionId] = answerId
    },
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload
    },
    calculateScore: (state) => {
      let correctCount = 0;
      state.questions.forEach(question => {
        if (state.answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });
      
      state.correctAnswers = correctCount;
      state.score = (correctCount / state.questions.length) * 100;
    },
    setExamResult: (state, action: PayloadAction<{ score: number; correctAnswers: number; attemptCount: number }>) => {
      state.score = action.payload.score;
      state.correctAnswers = action.payload.correctAnswers;
      state.attemptCount = action.payload.attemptCount;
      state.isSubmitted = true;
      state.hasCompletedExam = true;
      state.examResult = {
        score: action.payload.score,
        correctAnswers: action.payload.correctAnswers,
        attemptCount: action.payload.attemptCount,
      };
    },
    submitQuiz: (state) => {
      state.isSubmitted = true;
      let correctCount = 0;
      state.questions.forEach(question => {
        if (state.answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });
      
      const score = state.questions.length > 0 
        ? (correctCount / state.questions.length) * 100 
        : 0;
        
      state.correctAnswers = correctCount;
      state.score = score;
      state.hasCompletedExam = true;
      state.examResult = {
        score,
        correctAnswers: correctCount,
        attemptCount: state.attemptCount + 1,
      };
      state.attemptCount = state.attemptCount + 1;
    },
    resetQuiz: (state) => {
      state.currentQuestionId = 1
      state.answers = {}
      state.timeRemaining = 45 * 60
      state.isSubmitted = false
      state.hasCompletedExam = false
      state.examResult = null
    }
  },
})

export const { 
  setQuestions, 
  setLoading, 
  setError,
  setCurrentQuestion, 
  setAnswer, 
  setTimeRemaining, 
  submitQuiz, 
  resetQuiz,
  calculateScore,
  setExamResult
} = quizSlice.actions

export default quizSlice.reducer