"use client";

import { useRecoverPasswordMutation } from "@/features/auth/model/authApi";
import { ForgotPasswordForm } from "@/features/auth/ui/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const [recoverPassword, { isLoading }] = useRecoverPasswordMutation();

  const handleSubmit = async (email: string) => {
    try {
      await recoverPassword({ email });
    } catch (err: any) {
      console.error("Ошибка смены пароля:", err);
      alert(`Ошибка смены пароля: ${err?.data?.message}`);
    }
  };

  return <ForgotPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
