const TOKEN_COOKIE_NAME = "auth_token";
const TOKEN_MAX_AGE_SECONDS = 5 * 24 * 60 * 60;

const shouldUseSecureCookie = (): boolean => {
  const secureMode = process.env.NEXT_PUBLIC_AUTH_COOKIE_SECURE;

  if (secureMode === "true") return true;
  if (secureMode === "false") return false;

  if (typeof window !== "undefined") {
    return window.location.protocol === "https:";
  }

  return process.env.NODE_ENV === "production";
};

export const setAuthToken = (token: string) => {
  if (typeof document === "undefined") return;

  const securePart = shouldUseSecureCookie() ? "; secure" : "";
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}; samesite=lax${securePart}`;
};

export const getAuthToken = (): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${TOKEN_COOKIE_NAME}=`)
  );

  if (!tokenCookie) return undefined;

  const value = tokenCookie.split("=").slice(1).join("=");
  return decodeURIComponent(value);
};

export const removeAuthToken = () => {
  if (typeof document === "undefined") return;

  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
};
