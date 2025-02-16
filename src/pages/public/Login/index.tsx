import { useState, useCallback, useMemo, useEffect } from "react"
import AuthService from "../../../services/authService"
import {  Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { CustomButton } from "../../../components/ui/button"

export default function EmailLogin() {
  const { t } = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation();
  const registrationMessage = location.state?.message;

  const memoizedValidatePhone = useMemo(() => 
    (phone: string) => /^[0-9]{10}$/.test(phone),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!memoizedValidatePhone(phoneNumber)) {
      setError(t('login.invalidPhone'));
      return;
    }

    if (password.length < 6) {
      setError(t("login.passwordMinLength"))
      return
    }

    try {
      setIsLoading(true)
      const loginResult = await AuthService.login(phoneNumber, password)
      if (loginResult.success) {
        window.location.href = '/home';

      } else {
        setError(loginResult.message || t("login.unknownError"))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.unknownError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
  }, [])

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  useEffect(() => {
    return () => {
      setPhoneNumber('')
      setPassword('')
      setError('')
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        {registrationMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {registrationMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">{t("login.title")}</h2>
            <p className="text-gray-600 text-sm">{t("login.subtitle")}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              {t("login.phone")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="tel"
              placeholder={t("login.phonePlaceholder")}
              value={phoneNumber}
              onChange={handlePhoneChange}
              autoComplete="tel"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {t("login.password")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="space-y-4">
            <CustomButton
              type="submit"
              color="primary"
              className="w-full"
              isLoading={isLoading}
            >
              {t("login.submit")}
            </CustomButton>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">{t("login.noAccount")}</span>{" "}
              <Link 
                to="/register" 
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                {t("login.register")}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

