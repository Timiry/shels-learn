import { LessonDto } from "@/entities/course/model/coursesApi";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { extractYouTubeVideoId } from "../../lib/utils/validationYoutubeUrl";

export default function VideoLessonContent({ lesson }: { lesson: LessonDto }) {
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
        width="600"
        height="400"
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
