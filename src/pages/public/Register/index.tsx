import { useState, Suspense, lazy } from "react";
import AuthService from "../../../services/authService";
import { Link } from "react-router-dom";
import { CustomButton } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useTranslation } from "react-i18next";
import { LOCATION_CONSTANTS, TIEU_KHU } from "../../../lib/constants";

const RegistrationSuccessPortal = lazy(
  () => import("../../../components/auth/RegistrationSuccessPortal").then(module => ({
    default: module.RegistrationSuccessPortal
  }))
);

export default function RegisterPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    name: "",
    birthYear: new Date().getFullYear(),
    gender: "",
    tieuKhu: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPortal, setShowSuccessPortal] = useState(false);
  const [registeredPhone, setRegisteredPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all required fields
    if (!formData.name.trim()) {
      setError(t("register.nameRequired"));
      return;
    }

    if (!(/^\d{10}$/).exec(formData.phoneNumber)) {
      setError(t("register.invalidPhone"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("register.passwordMinLength"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("register.passwordMismatch"));
      return;
    }

    if (!formData.gender) {
      setError("Vui lòng chọn giới tính");
      return;
    }

    if (!formData.tieuKhu) {
      setError("Vui lòng chọn Tiểu khu");
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.register({
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        name: formData.name,
        birthYear: parseInt(formData.birthYear.toString()),
        gender: formData.gender as 'male' | 'female' | 'other',
        tieuKhu: formData.tieuKhu,
      });
      setRegisteredPhone(formData.phoneNumber);
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="confirmPassword"
                  >
                    {t("register.confirmPassword")}
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="birthYear">
                    Năm sinh
                  </label>
                  <select
                    id="birthYear"
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.birthYear}
                    onChange={(e) => setFormData({...formData, birthYear: parseInt(e.target.value)})}
                  >
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="gender">
                    {t("register.gender")}
                  </label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    required
                  >
                    <option value="">{t("register.selectGender")}</option>
                    <option value="male">{t("register.male")}</option>
                    <option value="female">{t("register.female")}</option>
                    <option value="other">{t("register.other")}</option>
                  </select>
                </div>

                <div>
                  <h3 className="block text-sm font-medium mb-1">
                    Địa chỉ
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{LOCATION_CONSTANTS.PROVINCE.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{LOCATION_CONSTANTS.WARD.name}</p>
                      </div>
                    </div>
                    
                    <select
                      id="tieuKhu"
                      className="w-full px-3 py-2 border rounded-md"
                      aria-label="Tiểu khu"
                      value={formData.tieuKhu}
                      onChange={(e) => setFormData({...formData, tieuKhu: e.target.value})}
                      required
                    >
                      <option value="">Chọn Tiểu khu</option>
                      {TIEU_KHU.map(tk => (
                        <option key={tk.code} value={tk.code}>
                          {tk.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
