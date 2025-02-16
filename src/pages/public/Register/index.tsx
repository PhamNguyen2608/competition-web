import { useState, Suspense, lazy } from "react";
import AuthService from "../../../services/authService";
import { Link } from "react-router-dom";
import { CustomButton } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useTranslation } from "react-i18next";

const RegistrationSuccessPortal = lazy(
  () => import("../../../components/auth/RegistrationSuccessPortal").then(module => ({
    default: module.RegistrationSuccessPortal
  }))
);

export default function RegisterPage() {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPortal, setShowSuccessPortal] = useState(false);
  const [registeredPhone, setRegisteredPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      setError(t("register.invalidPhone"));
      return;
    }

    if (password.length < 6) {
      setError(t("register.passwordMinLength"));
      return;
    }

    if (!name) {
      setError(t("register.nameRequired"));
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.register({
        phoneNumber,
        password,
        name,
      });
      setRegisteredPhone(phoneNumber);
      setShowSuccessPortal(true);
    } catch (error: any) {
      if (error.message.includes("đã được đăng ký")) {
        setError(t("register.accountExists"));
      } else {
        setError(t("register.unknownError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md">
          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-4 text-center">
                {t("register.title")}
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="name"
                  >
                    {t("register.name")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="phone"
                  >
                    {t("register.phone")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0987654321"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="password"
                  >
                    {t("register.password")}
                  </label>
                  <input
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <CustomButton
                  type="submit"
                  color="primary"
                  className="w-full mt-4"
                  isLoading={isLoading}
                >
                  {t("register.submit")}
                </CustomButton>

                <p className="text-center text-sm text-gray-600 mt-4">
                  <Link to="/login" className="text-primary hover:underline">
                    {t("register.existingAccount")}
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {showSuccessPortal && (
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <RegistrationSuccessPortal
            phoneNumber={registeredPhone}
            onClose={() => setShowSuccessPortal(false)}
          />
        </Suspense>
      )}
    </>
  );
}
