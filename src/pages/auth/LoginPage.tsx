"use client";

import { useLoginMutation } from "@/features/auth/api/authApi";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
    } catch (err) {
      alert("Ошибка авторизации");
      console.error("Ошибка авторизации:", err);
    }
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
