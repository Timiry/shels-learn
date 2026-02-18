interface User {
  /// убрать ///
  email: string;
  name: string;
  role: string;
}

// Вход в систему
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Активация аккаунта
export interface ActivateAccountPayload {
  password: string;
}

export interface ActivateAccountResponse {
  message: string;
  // Опционально: можно вернуть данные пользователя для автоматического входа
  // user?: User;
  // token?: string;
}

// Восстановление пароля
export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// Сброс пароля
export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}
