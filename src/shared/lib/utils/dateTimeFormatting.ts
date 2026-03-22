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
