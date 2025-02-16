import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { ExamResultService } from '../services/examResultService';
import { submitQuiz } from '../features/exam-question/quizSlice';

export function useGuardedNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubmitted, questions, answers } = useAppSelector((state) => state.quiz);
  const dispatch = useAppDispatch();

  const guardedNavigate = async (to: string) => {
    const isExamPage = location.pathname === '/exam/questions';
    
    if (isExamPage && !isSubmitted) {
      // Tự động submit khi thoát
      dispatch(submitQuiz());
      
      const correctCount = questions.reduce((count, question) => {
        return answers[question.id] === question.correctAnswer ? count + 1 : count;
      }, 0);

      const score = questions.length > 0 
        ? Math.round((correctCount / questions.length) * 100)
        : 0;

      await ExamResultService.saveResult({
        score,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
        answers
      });
    }
    
    navigate(to);
    return true;
  };

  return guardedNavigate;
} 