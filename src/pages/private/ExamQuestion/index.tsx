import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "../../../store/hooks"
import { QuizProgress } from "../../../components/layout/exam/QuizProgress"
import { QuestionCard } from "../../../components/layout/exam/QuestionCard"
import { QuestionNavigation } from "../../../components/layout/exam/QuestionNavigation"
import { QuizControls } from "../../../components/layout/exam/QuizControls"
import { useTranslation } from "react-i18next"
import { QuestionService } from "../../../services/questionService"
import { setQuestions, setExamResult, submitQuiz } from "../../../features/exam-question/quizSlice"
import  ExamResult  from "../../../components/layout/exam/ExamResult"
import { ExamResultService } from "../../../services/examResultService"

function QuizPage() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { 
    currentQuestionId, 
    isSubmitted,
    questions,
    loading,
    error,
    hasCompletedExam,
    examResult 
  } = useAppSelector((state) => state.quiz)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await QuestionService.getQuestions()
        dispatch(setQuestions(questions))
      } catch (error) {
        console.error('Failed to fetch questions:', error)
      }
    }

    fetchQuestions()
  }, [dispatch])

  useEffect(() => {
    const checkExamResult = async () => {
      try {
        const results = await ExamResultService.getUserResults()
        if (results && results.length > 0) {
          // Lấy kết quả mới nhất (có attemptCount cao nhất)
          const latestResult = results.reduce((prev, current) => 
            (current.attemptCount > prev.attemptCount) ? current : prev
          , results[0]);
          
          dispatch(setExamResult({
            score: latestResult.score,
            correctAnswers: latestResult.correctAnswers,
            attemptCount: latestResult.attemptCount,
            duration: latestResult.duration
          }))
        }
      } catch (error) {
        console.error('Failed to fetch exam results:', error)
      }
    }

    checkExamResult()
  }, [dispatch])

  const currentQuestion = questions.find((q) => q.id === currentQuestionId)

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center">{t('exam.loading')}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="text-center text-red-600">
          {t('exam.error')}
        </div>
      </div>
    )
  }

  if (hasCompletedExam && examResult) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <ExamResult />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <QuizProgress totalQuestions={questions.length} />
      {currentQuestion && <QuestionCard question={currentQuestion} />}
      <QuestionNavigation totalQuestions={questions.length} />
      <QuizControls totalQuestions={questions.length} />
    </div>
  )
}

export default function App() {
  return <QuizPage />
}

