import { useState,memo, useEffect, useRef } from "react"
import { CustomButton } from "../../../components/ui/button"
import { setCurrentQuestion, setExamResult, submitQuiz } from "../../../features/exam-question/quizSlice"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { useTranslation } from "react-i18next"
import { ExamWarningPortal } from "./ExamWarningPortal"
import { ExamResultService } from "../../../services/examResultService"
import { store } from "../../../store"
import { EXAM_CONFIG } from '../../../lib/constants'

interface QuizControlsProps {
  totalQuestions: number
}

export const QuizControls = memo(function QuizControls({ totalQuestions }: QuizControlsProps) {
  const { t } = useTranslation()
  const [showWarning, setShowWarning] = useState(false)
  const [startTime] = useState(() => Date.now())
  const currentQuestionId = useAppSelector((state) => state.quiz.currentQuestionId)
  const answers = useAppSelector((state) => state.quiz.answers)
  const dispatch = useAppDispatch()
  const { isSubmitted } = useAppSelector((state) => state.quiz)
  const { user } = useAppSelector((state) => state.auth)
  const hasAddedParticipant = useRef(false)

  const answeredCount = Object.keys(answers).length

  const handleSubmitClick = () => {
    if (answeredCount < totalQuestions) {
      setShowWarning(true)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!user || hasAddedParticipant.current) return;
    try {
      dispatch(submitQuiz())
      const state = store.getState().quiz
      
      const correctCount = state.questions.reduce((count, question) => {
        return state.answers[question.id] === question.correctAnswer ? count + 1 : count;
      }, 0);
      const score = state.questions.length > 0 
        ? Math.round((correctCount / state.questions.length) * 100)
        : 0;
      
      const duration = Math.floor((Date.now() - startTime) / 1000);
      
      const examResult = await ExamResultService.saveResult({
        score: score,
        correctAnswers: correctCount,
        totalQuestions: state.questions.length,
        answers: state.answers,
        tieuKhu: user.tieuKhu,
        userId: user.uid,
        duration: duration
      }, duration);

      // After successful submission, set the ref to true
      hasAddedParticipant.current = true;

      // Dispatch exam result immediately
      dispatch(setExamResult({
        score: examResult.score,
        correctAnswers: examResult.correctAnswers,
        attemptCount: examResult.attemptCount,
        duration: examResult.duration
      }));

    } catch (error) {
      console.error('Failed to save exam result:', error)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isSubmitted) {
        handleSubmit();
      }
    }, EXAM_CONFIG.DURATION * 1000); // Chuyển sang milliseconds

    return () => clearTimeout(timeoutId);
  }, [isSubmitted]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
        <CustomButton
          color="secondary"
          variant="outline"
          onClick={() => dispatch(setCurrentQuestion(Math.max(1, currentQuestionId - 1)))}
          disabled={currentQuestionId === 1}
          leftIcon={<span>←</span>}
          className="w-full sm:w-auto"
        >
          {t('quiz.navigation.previous')}
        </CustomButton>

        <CustomButton 
          color="destructive" 
          variant="solid"
          onClick={handleSubmitClick}
          className="w-full sm:w-auto order-first sm:order-none"
        >
          {t('quiz.navigation.submit')}
        </CustomButton>

        <CustomButton
          color="secondary"
          variant="outline"
          onClick={() => dispatch(setCurrentQuestion(Math.min(totalQuestions, currentQuestionId + 1)))}
          disabled={currentQuestionId === totalQuestions}
          rightIcon={<span>→</span>}
          className="w-full sm:w-auto"
        >
          {t('quiz.navigation.next')}
        </CustomButton>
      </div>

      {showWarning && (
        <ExamWarningPortal
          type="submit"
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          onConfirm={() => {
            handleSubmit()
            setShowWarning(false)
          }}
          onCancel={() => setShowWarning(false)}
        />
      )}
    </>
  )
})

