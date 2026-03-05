/**
 * Проверка валидности токена без запроса к серверу
 * (для быстрой первичной проверки при загрузке приложения)
 */
export const isTokenValid = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    // Для JWT можно проверить срок действия
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

/**
 * Извлечение токена активации/сброса из URL
 */
export const parseTokenFromUrl = (
  searchParams: URLSearchParams | null
): string | null => {
  const token = searchParams?.get("token");
  if (!token || token.length < 10) return null;

  return token;
};

/**
 * Очистка чувствительных данных после успешных операций
 */
export const cleanupAuthParams = () => {
  if (typeof window === "undefined") return;

  // Удаляем токены из URL после обработки
  if (window.location.search.includes("token")) {
    window.history.replaceState(null, "", window.location.pathname);
  }
};
