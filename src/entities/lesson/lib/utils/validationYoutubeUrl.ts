/**
 * Проверяет валидность ссылки на YouTube видео
 * @param url - Ссылка на видео
 * @returns Объект с результатом проверки
 */
export function isValidYouTubeUrl(url: string): {
  valid: boolean;
  videoId?: string;
  error?: string;
} {
  // Проверка на пустую строку
  if (!url || typeof url !== "string" || url.trim() === "") {
    return { valid: false, error: "Ссылка не может быть пустой" };
  }

  // Регулярные выражения для разных форматов YouTube ссылок
  const patterns = [
    // Формат: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:[&?#].*)?/,

    // Формат: https://youtu.be/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?#].*)?/,

    // Формат: https://www.youtube.com/embed/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?#].*)?/,

    // Формат: https://www.youtube.com/shorts/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?#].*)?/,

    // Формат: с параметрами (например: ?v=ID&t=...)
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})(?:[&?#].*)?/,
  ];

  // Проверяем каждый паттерн
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];

      // Проверка длины и формата видео ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return { valid: true, videoId };
      }
    }
  }

  return {
    valid: false,
    error:
      "Неверный формат ссылки на YouTube видео. Поддерживаются форматы:\n" +
      "• https://www.youtube.com/watch?v=VIDEO_ID\n" +
      "• https://youtu.be/VIDEO_ID\n" +
      "• https://www.youtube.com/embed/VIDEO_ID\n" +
      "• https://www.youtube.com/shorts/VIDEO_ID",
  };
}

/**
 * Упрощенная версия - возвращает только boolean
 */
export function isYouTubeUrl(url: string): boolean {
  return isValidYouTubeUrl(url).valid;
}

/**
 * Извлекает видео ID из ссылки (возвращает null если не валидная)
 */
export function extractYouTubeVideoId(url: string): string | null {
  const result = isValidYouTubeUrl(url);
  return result.valid ? result.videoId || null : null;
}
