import { setAuthToken } from "@/shared/lib/auth/cookies";
import { baseApi as api } from "../../../shared/api/baseApi";
import {
  ApiResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RecoverPasswordRequest,
  SetPasswordApiArg,
} from "./types";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    setPassword: build.mutation<ApiResponse, SetPasswordApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/auth/set-password`,
        method: "POST",
        body: queryArg.setPasswordRequest,
        params: {
          token: queryArg.token,
        },
      }),
    }),
    recoverPassword: build.mutation<ApiResponse, RecoverPasswordRequest>({
      query: (queryArg) => ({
        url: `/api/v1/auth/recover-password`,
        method: "POST",
        body: queryArg,
      }),
    }),
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (queryArg) => ({
        url: `/api/v1/auth/login`,
        method: "POST",
        body: queryArg,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Сохраняем токен только на клиенте
          setAuthToken(data.token);
        } catch {
          // Ошибка обрабатывается в компоненте
        }
      },
      invalidatesTags: ["User"],
    }),
    changePassword: build.mutation<ApiResponse, ChangePasswordRequest>({
      query: (queryArg) => ({
        url: `/api/v1/auth/change-password`,
        method: "POST",
        body: queryArg,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as authApi };

export const {
  useSetPasswordMutation,
  useRecoverPasswordMutation,
  useLoginMutation,
  useChangePasswordMutation,
} = injectedRtkApi;
