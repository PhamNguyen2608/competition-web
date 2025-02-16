import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card/index"
import type { Question } from "../../../types/question"
import { setAnswer } from "../../../features/exam-question/quizSlice"
import { memo } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"

interface QuestionCardProps {
  question: Question
}

export const QuestionCard = memo(function QuestionCard({ question }: QuestionCardProps) {
  const selectedAnswer = useAppSelector((state) => state.quiz.answers[question.id])
  const dispatch = useAppDispatch()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Câu hỏi {question.id}. {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer || ""}
          onValueChange={(value) => dispatch(setAnswer({ questionId: question.id, answerId: value }))}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center rounded-lg border p-4 transition-colors duration-300 ${
                selectedAnswer === option.id ? "bg-muted" : ""
              }`}
            >
              <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} className="mr-3" />
              <Label htmlFor={`q${question.id}-${option.id}`} className="flex-grow cursor-pointer">
                {option.id}. {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
})

