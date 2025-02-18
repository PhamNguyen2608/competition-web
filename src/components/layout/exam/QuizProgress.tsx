import { Progress } from "../../../components/ui/progress/Progress";
import { useAppSelector } from "../../../store/hooks";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { QuizTimer } from "./QuizTimer";

interface QuizProgressProps {
  totalQuestions: number;
}

export const QuizProgress = memo(function QuizProgress({ totalQuestions }: QuizProgressProps) {
  const { t } = useTranslation();

  // Lấy luôn số câu đã trả lời thay vì toàn bộ answers
  const answeredCount = useAppSelector((state) => Object.keys(state.quiz.answers).length);

  const progressPercentage = useMemo(() => {
    return (answeredCount / totalQuestions) * 100;
  }, [answeredCount, totalQuestions]);

  return (
    <div className="space-y-4 mb-6">
      <QuizTimer />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{t('quiz.progress.title')}</span>
        <span>
          {answeredCount}/{totalQuestions} {t('quiz.progress.count')}
        </span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
});
