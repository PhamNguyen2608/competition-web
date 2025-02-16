import { Portal, PortalContent } from "../../Portal"
import * as Card from "../../ui/card"
import { CustomButton } from "../../ui/button"
import { useTranslation } from "react-i18next"

interface ExamWarningPortalProps {
  readonly type: "leave" | "submit"
  readonly totalQuestions: number
  readonly answeredCount: number
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

export function ExamWarningPortal({
  type,
  totalQuestions,
  answeredCount,
  onConfirm,
  onCancel
}: ExamWarningPortalProps) {
  const { t } = useTranslation()

  const messages = {
    leave: {
      title: t("quiz.warning.leaveTitle"),
      content: t("quiz.warning.leaveContent", {
        answered: answeredCount,
        total: totalQuestions
      })
    },
    submit: {
      title: t("quiz.warning.submitTitle"), 
      content: t("quiz.warning.submitContent", {
        answered: answeredCount,
        total: totalQuestions
      })
    }
  }

  return (
    <Portal>
      <PortalContent position="center" onClose={onCancel} className="w-full max-w-md p-4">
        <Card.Card>
          <Card.CardHeader>
            <h2 className="text-lg font-semibold text-red-600">
              {messages[type].title}
            </h2>
          </Card.CardHeader>
          <Card.CardContent>
            <p className="text-gray-600">
              {messages[type].content}
            </p>
          </Card.CardContent>
          <div className="flex justify-end gap-4 p-6">
            <CustomButton
              variant="outline"
              color="muted"
              onClick={onCancel}
            >
              {t("quiz.warning.cancel")}
            </CustomButton>
            <CustomButton
              color="destructive"
              onClick={onConfirm}
            >
              {t("quiz.warning.confirm")}
            </CustomButton>
          </div>
        </Card.Card>
      </PortalContent>
    </Portal>
  )
} 