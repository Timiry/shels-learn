import { LessonDto } from "@/entities/course/model/types";
import Box from "@mui/material/Box";

export default function TextLessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box dangerouslySetInnerHTML={{ __html: lesson.theoryContent || "" }}></Box>
  );
}
