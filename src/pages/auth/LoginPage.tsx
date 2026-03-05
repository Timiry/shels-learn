"use client";

import { useLoginMutation } from "@/features/auth/model/authApi";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { routes } from "@/shared/config/routes";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      if (result.role === "ADMIN") {
        router.push(routes.admin.courses.allCourses);
      } else {
        router.push(routes.student.learning);
      }
    } catch (err: any) {
      console.error("Ошибка авторизации:", err);
      alert(`Ошибка авторизации: ${err?.data?.message}`);
    }
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
