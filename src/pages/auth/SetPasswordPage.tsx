"use client";

import { useSearchParams } from "next/navigation";
import {
  parseTokenFromUrl,
  cleanupAuthParams,
} from "@/features/auth/lib/utils/tokens";
import { SetPasswordForm } from "@/features/auth/ui/SetPasswordForm";
import { useSetPasswordMutation } from "@/features/auth/model/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/shared/config/routes";
export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [setPassword, { isLoading }] = useSetPasswordMutation();

  const token = parseTokenFromUrl(searchParams);

  useEffect(() => {
    if (!token) {
      alert("Невалидная ссылка активации");
    }
    cleanupAuthParams();
  }, [token, router]);

  const handleSubmit = async (password: string) => {
    if (!token) return;

    try {
      await setPassword({ token, setPasswordRequest: { password } }).unwrap();
      router.push(routes.auth.login);
    } catch (err: any) {
      console.error("Ошибка установления пароля:", err);
      alert(`Ошибка установления пароля: ${err?.data?.message}`);
    }
  };

  return <SetPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
