import { LessonDto } from "@/entities/course/model/coursesApi";
import Box from "@mui/material/Box";
import PdfLessonContent from "./PdfLessonContent";
import TextLessonContent from "./TextLessonContent";
import VideoLessonContent from "./VideoLessonContent";
import TestLessonContent from "./TestLessonContent";
import { Stack, Typography } from "@mui/material";
import LessonOption from "./lessonOption";
import TaskLessonContent from "./TaskLessonContent";

export default function LessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box mb={5}>
      <Stack direction={"row"} spacing={2} mb={4} flexWrap="wrap" useFlexGap>
        <LessonOption name="Баллы" value={lesson?.fullPoints.toString()} />
        {lesson.passingThresholdPercent && (
          <LessonOption
            name="Порог прохождения"
            value={lesson.passingThresholdPercent.toString() + "%"}
          />
        )}
        {lesson.stopLesson === true && <LessonOption name="Стоп-урок" />}
        {lesson.attemptLimit && (
          <LessonOption
            name="Ограничение попыток"
            value={lesson.attemptLimit.toString()}
          />
        )}
        {lesson.timeLimitMinutes && (
          <LessonOption
            name="Ограничение времени"
            value={lesson.timeLimitMinutes.toString() + " мин"}
          />
        )}
        {lesson.shuffleOnEveryAttempt && (
          <LessonOption name="Перемешивание вариантов ответа" />
        )}
      </Stack>
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
        <TaskLessonContent lesson={lesson} />
      )}
    </Box>
  );
}
