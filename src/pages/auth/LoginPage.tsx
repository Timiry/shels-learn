"use client";

import { useLoginMutation } from "@/features/auth/api/authApi";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { routes } from "@/shared/config/routes";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      if (result.user.role === "ADMIN") {
        router.push(routes.admin.courses);
      } else {
        router.push(routes.student.learning);
      }
    } catch (err) {
      alert("Ошибка авторизации");
      console.error("Ошибка авторизации:", err);
    }
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
