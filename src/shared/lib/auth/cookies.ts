export const setAuthToken = (token: string) => {
  // Устанавливаем куку без HttpOnly, но с защитой от атак
  document.cookie = `auth_token=${token}; path=/; max-age=${5 * 24 * 60 * 60}; ${
    process.env.NODE_ENV === "production" ? "secure; " : ""
  }samesite=strict`;
};

export const getAuthToken = (): string | undefined => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("auth_token=")
  );
  return tokenCookie?.split("=")[1];
};

export const removeAuthToken = () => {
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict";
};
