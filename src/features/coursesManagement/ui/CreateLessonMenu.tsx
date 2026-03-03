import { LessonType } from "@/entities/course/model/types";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";
import { Box, IconButton, Stack, Typography } from "@mui/material";

export default function CreateLessonMenu({
  onIconClick,
}: {
  onIconClick: (lessonType: LessonType) => void;
}) {
  return (
    <Stack spacing={4} alignItems={"center"} justifyContent={"center"} mt={10}>
      <Typography variant="h3">Добавлене урока</Typography>
      <Typography variant="subtitle1">Теория</Typography>
      <Stack direction={"row"} spacing={5}>
        <Box>
          <IconButton onClick={() => onIconClick("THEORY_PDF")}>
            {lessonTypeToIcon.THEORY_PDF}
          </IconButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            PDF
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => onIconClick("THEORY_TEXT")}>
            {lessonTypeToIcon.THEORY_TEXT}
          </IconButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            Текст
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => onIconClick("THEORY_VIDEO")}>
            {lessonTypeToIcon.THEORY_VIDEO}
          </IconButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            Видео
          </Typography>
        </Box>
      </Stack>
      <Typography variant="subtitle1">Практика</Typography>
      <Stack direction={"row"} spacing={5}>
        <Box>
          <IconButton onClick={() => onIconClick("PRACTICE_TEST")}>
            {lessonTypeToIcon.PRACTICE_TEST}
          </IconButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            Тест
          </Typography>
        </Box>
        <Box>
          <IconButton onClick={() => onIconClick("PRACTICE_OPEN_ANSWER")}>
            {lessonTypeToIcon.PRACTICE_OPEN_ANSWER}
          </IconButton>
          <Typography variant="subtitle2" textAlign={"center"}>
            Задание
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}
