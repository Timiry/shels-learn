import { LessonDto } from "@/entities/course/model/types";
import Box from "@mui/material/Box";
import PdfLessonContent from "./PdfLessonContent";
import TextLessonContent from "./TextLessonContent";
import VideoLessonContent from "./VideoLessonContent";
import TestLessonContent from "./TestLessonContent";
import TasLessonContent from "./TaskLessonContent";
import { Typography } from "@mui/material";

export default function LessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box mb={5}>
      <Box mb={4}>
        <Box
          p={1}
          border={"1px solid"}
          borderColor={"divider"}
          borderRadius={1}
          display={"inline"}
        >
          <Typography variant="body1" display={"inline"}>
            Баллы:{" "}
          </Typography>
          <Typography variant="body1" color="secondary" display={"inline"}>
            {lesson.fullPoints}
          </Typography>
        </Box>
      </Box>
      <Typography variant="h1" sx={{ mb: 4 }}>
        {lesson.title}
      </Typography>
      {lesson.lessonType === "THEORY_PDF" && (
        <PdfLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "THEORY_TEXT" && (
        <TextLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "THEORY_VIDEO" && (
        <VideoLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "PRACTICE_TEST" && (
        <TestLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "PRACTICE_OPEN_ANSWER" && (
        <TasLessonContent lesson={lesson} />
      )}
    </Box>
  );
}
