import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../store/hooks"
import { Card } from "../../../components/ui/card"
import { CustomButton } from "../../../components/ui/button"
import { Clock, FileText, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EXAM_RULES } from "../../../lib/constants"

export default function ExamPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAppSelector(state => state.auth)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleStartExam = () => {
    navigate('/exam/questions')
  }

  return (
    <div className="container-custom py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-6 font-display text-center">
            {t('exam.title')}
          </h1>

          <div className="space-y-6">
            {/* Exam Info Card */}
            <div className="bg-amber-50/60 rounded-xl p-6 border border-amber-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">{t('exam.time.label')}</p>
                    <p className="font-medium">{t('exam.time.value')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">{t('exam.questions.label')}</p>
                    <p className="font-medium">{t('exam.questions.value')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-600">{t('exam.passingScore.label')}</p>
                    <p className="font-medium">{t('exam.passingScore.value')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rules Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-neutral-800">
                {t('exam.importantNotes.title')}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-600">
                {EXAM_RULES.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Start Button */}
            <div className="pt-6 border-t">
              <div className="text-center space-y-4">
                <CustomButton
                  color="primary"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={handleStartExam}
                >
                  {t('exam.startButton')}
                </CustomButton>
                <p className="text-sm text-gray-500">
                  {t('exam.startHint')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}