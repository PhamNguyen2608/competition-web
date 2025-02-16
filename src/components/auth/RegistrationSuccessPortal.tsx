import { Portal } from '../Portal'
import { CustomButton } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface RegistrationSuccessPortalProps {
  phoneNumber: string
  onClose: () => void
}

export function RegistrationSuccessPortal({ phoneNumber, onClose }: Readonly<RegistrationSuccessPortalProps>) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogin = () => {
    onClose()
    navigate('/login', {
      state: {
        preFilledPhone: phoneNumber
      }
    })
  }

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            {t('registrationSuccess.title')}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {t('registrationSuccess.phoneMessage')} <br />
            <span className="font-semibold">{phoneNumber}</span>
          </p>
          <p className="text-center text-gray-600 mb-6">
            {t('registrationSuccess.loginPrompt')}
          </p>
          <div className="flex justify-center">
            <CustomButton
              color="primary"
              onClick={handleLogin}
              className="w-full max-w-xs"
            >
              {t('registrationSuccess.loginButton')}
            </CustomButton>
          </div>
        </div>
      </div>
    </Portal>
  )
} 