"use client";

import { useSearchParams } from "next/navigation";
import {
  parseTokenFromUrl,
  cleanupAuthParams,
} from "@/features/auth/lib/utils/tokens";
import { ActivateAccountForm } from "@/features/auth/ui/ActivateAccountForm";
import { useActivateAccountMutation } from "@/features/auth/api/authApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes } from "@/shared/config/routes";
export default function ActivateAccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activateAccount, { isLoading }] = useActivateAccountMutation();

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
      await activateAccount({ password }).unwrap();
      router.push(routes.auth.login);
    } catch (err) {
      console.error("Ошибка активации:", err);
      alert("Ошибка активации");
    }
  };

  return <ActivateAccountForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
