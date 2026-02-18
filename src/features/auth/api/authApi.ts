import { baseApi } from "@/shared/api/baseApi";
import { endpoints } from "@/shared/config/endpoints";
import {
  LoginResponse,
  LoginCredentials,
  ActivateAccountResponse,
  ActivateAccountPayload,
  ForgotPasswordResponse,
  ForgotPasswordPayload,
  ResetPasswordResponse,
  ResetPasswordPayload,
} from "../model/types";
// import { User } from "@/entities/user/model/types";

interface User {
  email: string;
  name: string;
  role: string;
}

// ======================
// RTK QUERY API
// ======================

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Вход в систему
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: endpoints.auth.login,
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Сохраняем токен только на клиенте
          if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            // Опционально: сохраняем роль для быстрого определения интерфейса
            localStorage.setItem("userRole", data.user.role);
          }
        } catch {
          // Ошибка обрабатывается в компоненте
        }
      },
      invalidatesTags: ["User"],
    }),

    // 2. Выход из системы
    logout: builder.mutation<void, void>({
      query: () => ({
        url: endpoints.auth.logout,
        method: "POST",
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          // Очищаем данные только после успешного ответа от сервера
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            localStorage.removeItem("activeRole");
          }
        } catch {
          // Если ошибка - не очищаем данные (возможно, сетевая проблема)
        }
      },
      invalidatesTags: ["User"],
    }),

    // 3. Получение текущего пользователя
    getCurrentUser: builder.query<User, void>({
      query: () => endpoints.auth.me,
      providesTags: ["User"],
      // Дополнительная защита: не кэшируем дольше 5 минут
      keepUnusedDataFor: 300,
    }),

    // 4. Активация аккаунта (установка пароля при первом входе)
    activateAccount: builder.mutation<
      ActivateAccountResponse,
      ActivateAccountPayload
    >({
      query: (payload) => ({
        url: endpoints.auth.setPassword,
        method: "POST",
        body: payload,
      }),
      // Не инвалидируем теги - после активации пользователь НЕ авторизован
      // Перенаправление на /login происходит в компоненте
    }),

    // 5. Запрос на восстановление пароля
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordPayload
    >({
      query: (payload) => ({
        url: endpoints.auth.forgotPassword,
        method: "POST",
        body: payload,
      }),
      // Публичный эндпоинт - не требует токена
    }),

    // 6. Сброс пароля по токену
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordPayload
    >({
      query: (payload) => ({
        url: endpoints.auth.resetPassword,
        method: "POST",
        body: payload,
      }),
      // После сброса пароля пользователь НЕ авторизован
      // Перенаправление на /login происходит в компоненте
    }),
  }),
});

// ======================
// ХУКИ ДЛЯ ИСПОЛЬЗОВАНИЯ В КОМПОНЕНТАХ
// ======================

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useActivateAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
