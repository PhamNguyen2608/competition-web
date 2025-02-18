import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setTimeRemaining, submitQuiz } from "../../../features/exam-question/quizSlice";
import { ExamResultService } from "../../../services/examResultService";
import { ParticipantService } from "../../../services/participantService";

export const QuizTimer = memo(function QuizTimer() {
  const dispatch = useAppDispatch();
  const { timeRemaining, questions, answers, isSubmitted } = useAppSelector((state) => state.quiz);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSubmitted && timeRemaining > 0) {
        dispatch(setTimeRemaining(timeRemaining - 1));
        console.log('Time remaining:', timeRemaining - 1);
      }
      
      if (timeRemaining === 0 && !isSubmitted && user) {
        console.log('Time is up! Auto submitting...');
        dispatch(submitQuiz());
        const correctCount = questions.reduce((count, question) => {
          return answers[question.id] === question.correctAnswer ? count + 1 : count;
        }, 0);
        
        const score = questions.length > 0 
          ? Math.round((correctCount / questions.length) * 100)
          : 0;

        // Chỉ lưu exam result, không thêm participant
        ExamResultService.saveResult({
          score,
          correctAnswers: correctCount,
          totalQuestions: questions.length,
          answers,
          tieuKhu: user.tieuKhu,
          userId: user.uid,
          duration: 5 // Full duration for timeout
        }, 5).then(() => {
          console.log('Result saved successfully after timeout');
        }).catch(error => {
          console.error('Error saving result after timeout:', error);
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted, dispatch, user]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="text-center font-medium text-lg">
      <span className="text-gray-700">Thời gian còn lại: </span>
      <span className={`${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}); 