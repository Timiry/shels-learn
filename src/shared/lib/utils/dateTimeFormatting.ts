export function formatDateFromTimestamp(timestamp: number): string {
  try {
    const date = new Date(timestamp * 1000);
    if (isNaN(date.getTime())) return "";

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Форматирует дату в формат "DD.MM.YYYY HH:MM"
 * @param date - timestamp в секундах (number) или ISO-строка (string)
 * @returns отформатированная строка даты, например "23.03.2026 15:53"
 */
export const formatDateTime = (date: number | string): string => {
  const dateObj =
    typeof date === "number"
      ? new Date(date * 1000) // конвертируем секунды → миллисекунды
      : new Date(date); // парсим ISO-строку

  if (isNaN(dateObj.getTime())) {
    return "-"; // fallback для невалидных дат
  }

  const pad = (num: number) => String(num).padStart(2, "0");

  const day = pad(dateObj.getDate());
  const month = pad(dateObj.getMonth() + 1); // getMonth() от 0 до 11
  const year = dateObj.getFullYear();
  const hours = pad(dateObj.getHours());
  const minutes = pad(dateObj.getMinutes());

  return `${day}.${month}.${year} ${hours}:${minutes}`;
};
