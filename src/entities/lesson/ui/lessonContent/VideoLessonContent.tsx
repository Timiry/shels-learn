import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import {
  extractYouTubeVideoId,
  isYouTubeUrl,
} from "../../lib/utils/validationYoutubeUrl";

export default function VideoLessonContent<
  T extends { theoryContent?: string },
>({ lesson }: { lesson: T }) {
  const videoUrl = lesson.theoryContent || "";

  // Определяем тип видео
  const isYouTube = isYouTubeUrl(videoUrl);
  const isServerVideo =
    !isYouTube &&
    videoUrl &&
    (videoUrl.endsWith(".mp4") ||
      videoUrl.endsWith(".webm") ||
      videoUrl.endsWith(".mov") ||
      videoUrl.includes("/files/") ||
      videoUrl.startsWith("http"));

  // Обработка отсутствия видео
  if (!videoUrl) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        Видео для этого урока не найдено.
      </Alert>
    );
  }

  // Обработка невалидного видео
  if (!isYouTube && !isServerVideo) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Невозможно определить тип видео. Проверьте корректность ссылки.
      </Alert>
    );
  }

  // Отображение YouTube видео
  if (isYouTube) {
    const youtubeId = extractYouTubeVideoId(videoUrl);

    if (!youtubeId) {
      return (
        <Alert severity="error" sx={{ my: 2 }}>
          Невозможно проиграть видео: неверная ссылка на YouTube.
        </Alert>
      );
    }

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9 aspect ratio
          bgcolor: "grey.200",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <iframe
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            border: 0,
          }}
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </Box>
    );
  }

  // Отображение видео с сервера
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "grey.200",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <video
        controls
        width="100%"
        style={{
          display: "block",
          aspectRatio: "16 / 9",
          backgroundColor: "#000",
        }}
        onError={(e) => {
          console.error("Ошибка загрузки видео:", e);
        }}
      >
        {/* Абсолютный путь для относительных ссылок */}
        <source
          src={
            videoUrl.startsWith("http")
              ? videoUrl
              : `http://217.26.31.189:8080${videoUrl}`
          }
          type={
            videoUrl.endsWith(".mp4")
              ? "video/mp4"
              : videoUrl.endsWith(".webm")
                ? "video/webm"
                : "video/mp4"
          }
        />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </Box>
  );
}
