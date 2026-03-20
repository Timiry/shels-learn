import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { extractYouTubeVideoId } from "../../lib/utils/validationYoutubeUrl";

export default function VideoLessonContent<
  T extends { theoryContent?: string },
>({ lesson }: { lesson: T }) {
  const videoUrl = lesson.theoryContent || "";
  const youtubeId = extractYouTubeVideoId(videoUrl);

  if (!youtubeId) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Невозможно проиграть видео: неверная YouTube ссылка.
      </Alert>
    );
  }

  return (
    <Box>
      <iframe
        width="100%"
        style={{ aspectRatio: "16 / 9" }}
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
