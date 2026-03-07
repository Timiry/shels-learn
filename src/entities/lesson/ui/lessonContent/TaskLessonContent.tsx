import { LessonDto } from "@/entities/course/model/types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SingleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MultipleIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import LessonOption from "./lessonOption";
import Divider from "@mui/material/Divider";
import TaskIcon from "@mui/icons-material/LiveHelpOutlined";

export default function TaskLessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box>
      {lesson.questions && (
        <Stack spacing={5}>
          {lesson.questions.map((question, index) => (
            <Stack spacing={1} key={question.id}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box display={"flex"} alignItems={"center"}>
                  <TaskIcon />
                  <Typography variant="subtitle2" display={"inline"} pl={2}>
                    Вопрос № {index + 1}
                  </Typography>
                </Box>
                <LessonOption name="Баллы" value={`${question.fullPoints}`} />
              </Box>
              <Divider />
              <Typography variant="body2">{question.questionText}</Typography>
              {question.trainerHint && (
                <Box pt={2}>
                  <Typography
                    variant="caption"
                    display="inline"
                    sx={{
                      bgcolor: "divider",
                      borderRadius: "5px",
                      p: "5px 10px",
                    }}
                  >
                    ? Подсказка
                  </Typography>
                  <Typography variant="body2" pt={1}>
                    {question.trainerHint}
                  </Typography>
                </Box>
              )}
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
