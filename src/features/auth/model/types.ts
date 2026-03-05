export type SetPasswordApiArg = {
  token: string;
  setPasswordRequest: SetPasswordRequest;
};

export type ApiResponse = {
  message?: string;
};
export type SetPasswordRequest = {
  /** Новый пароль */
  password: string;
};
export type RecoverPasswordRequest = {
  /** Email пользователя для восстановления */
  email: string;
};
export type LoginResponse = {
  /** JWT access token */
  token: string;
  /** ID пользователя */
  userId: number;
  /** Email пользователя */
  email: string;
  /** Роль пользователя */
  role: "ADMIN" | "STUDENT";
};
export type LoginRequest = {
  /** Email пользователя */
  email: string;
  /** Пароль пользователя */
  password: string;
};
export type ChangePasswordRequest = {
  /** Текущий пароль */
  currentPassword: string;
  /** Новый пароль */
  newPassword: string;
};
