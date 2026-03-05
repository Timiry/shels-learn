import * as z from "zod";

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Пароль должен содержать не менее 8 символов")
      .regex(/(?=.*[a-z])/, "Пароль должен содержать строчную букву")
      .regex(/(?=.*[A-Z])/, "Пароль должен содержать заглавную букву")
      .regex(/(?=.*\d)/, "Пароль должен содержать цифру"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });
