import { CustomButton } from "../../../components/ui/button"
import { cn } from "../../../lib/utils"
import { memo } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { setCurrentQuestion } from "../../../features/exam-question/quizSlice"

interface QuestionNavigationProps {
  totalQuestions: number
}

export const QuestionNavigation = memo(function QuestionNavigation({ totalQuestions }: QuestionNavigationProps) {
  const { currentQuestionId, answers } = useAppSelector((state) => state.quiz)
  const dispatch = useAppDispatch()

  return (
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-6">
      {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((questionId) => (
        <TooltipProvider key={questionId}>
          <Tooltip>
            <TooltipTrigger asChild>
              <CustomButton
                variant={answers[questionId] ? "solid" : "outline"}
                className={cn(
                  "h-10 w-full",
                  currentQuestionId === questionId && "ring-2 ring-primary ring-offset-2",
                  answers[questionId] && "bg-green-600 hover:bg-green-700",
                )}
                onClick={() => dispatch(setCurrentQuestion(questionId))}
              >
                {questionId}
              </CustomButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Câu {questionId}: {answers[questionId] ? `Đã chọn ${answers[questionId]}` : "Chưa làm"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  )
})

