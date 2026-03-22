import { LessonDto } from "@/entities/course/model/coursesApi";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SingleIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MultipleIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import LessonOption from "./lessonOption";
import Divider from "@mui/material/Divider";

export default function TestLessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box>
      {lesson.questions && (
        <Stack spacing={4}>
          {lesson.questions.map((question, index) => (
            <Stack spacing={1} key={question.id}>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box display={"flex"} alignItems={"center"}>
                  {question.questionType === "SINGLE_CHOICE" ? (
                    <SingleIcon />
                  ) : (
                    <MultipleIcon />
                  )}
                  <Typography variant="subtitle2" display={"inline"} pl={2}>
                    Вопрос № {index + 1}
                  </Typography>
                </Box>
                <LessonOption
                  name="Баллы"
                  value={`${question.fullPoints} / ${question.partialPoints} / 0`}
                />
              </Box>
              <Divider />
              <Typography variant="body2">{question.questionText}</Typography>
              <Box>
                {question.options?.map((option, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    display={"block"}
                    p={1}
                    m={"4px"}
                    borderRadius={1}
                    bgcolor={
                      question.correctAnswers?.includes(option)
                        ? "success.main"
                        : "inherit"
                    }
                  >
                    {option}
                  </Typography>
                ))}
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}
