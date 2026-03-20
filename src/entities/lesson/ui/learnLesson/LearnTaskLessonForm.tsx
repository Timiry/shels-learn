"use client";

import {
  Box,
  Typography,
  TextField,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  LearnerLessonDto,
  LessonProgressStatus,
  SubmitPracticeApiArg,
} from "@/features/student/api/studentApi";
import LessonOption from "../lessonContent/lessonOption";

interface LearnTaskLessonFormProps {
  lesson: LearnerLessonDto;
  lessonStatus?: LessonProgressStatus;
  formId: string;
  onSubmit: (data: SubmitPracticeApiArg) => void;
}

export default function LearnTaskLessonForm({
  lesson,
  lessonStatus,
  formId,
  onSubmit,
}: LearnTaskLessonFormProps) {
  // Состояние для хранения ответов: { "0": ["текст ответа"], "1": ["другой ответ"] }
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});

  // Инициализация состояния ответов
  useEffect(() => {
    if (lesson.questions) {
      const initialAnswers: { [key: string]: string[] } = {};
      lesson.questions.forEach((question) => {
        initialAnswers[question.id.toString()] = question.userAnswers || [""];
      });
      setAnswers(initialAnswers);
    }
  }, [lesson.questions]);

  // Обработчик изменения текста ответа
  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: [value],
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (!areAllQuestionsAnswered()) {
    //   alert("Вы ответили не на все вопросы");
    //   return;
    // }

    // Форматируем данные для отправки
    const submissionData: SubmitPracticeApiArg = {
      lessonId: lesson.id,
      practiceSubmissionRequest: {
        questionAnswers: answers, // Используем правильную структуру
      },
    };

    onSubmit(submissionData);
  };

  // // Проверка, все ли вопросы имеют ответы (не пустые)
  // const areAllQuestionsAnswered = () => {
  //   if (!lesson.questions) return false;

  //   return lesson.questions.every((question, index) => {
  //     const answer = answers[(index + 1).toString()]?.[0] || "";
  //     return answer.trim().length > 0;
  //   });
  // };

  if (!lesson.questions || lesson.questions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        В этом уроке нет вопросов для ответа.
      </Alert>
    );
  }

  return (
    <Box
      component="form"
      id={formId}
      onSubmit={handleSubmit}
      sx={{ width: "100%" }}
    >
      <Stack spacing={3}>
        {/* Вопросы */}
        {lesson.questions.map((question) => {
          const answer = answers[question.position.toString()]?.[0] || "";

          return (
            <Box
              key={question.position}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  {`Вопрос № ${question.position}`}
                </Typography>
                {lessonStatus !== "STARTED" &&
                  question.status === "ACCEPTED" && (
                    <LessonOption
                      name="Получено баллов"
                      value={`${question.awardedPoints} из ${question.fullPoints}`}
                    />
                  )}
              </Box>
              <Typography
                variant="body1"
                sx={{ mb: 2, whiteSpace: "pre-wrap" }}
              >
                {question.questionText}
              </Typography>

              <Divider sx={{ mb: 2 }} />
              {question?.status === "ACCEPTED" && (
                <Typography
                  variant="body1"
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#b4e1a9", borderRadius: "5px" }}
                >
                  Ответ принят
                </Typography>
              )}
              {question?.status === "REJECTED" && (
                <Typography
                  variant="body1"
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#f4b2a3", borderRadius: "5px" }}
                >
                  Ответ не принят
                </Typography>
              )}
              {question?.status === "PENDING_REVIEW" && (
                <Typography
                  variant="body1"
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#ece4a0", borderRadius: "5px" }}
                >
                  Ответ ожидает проверки
                </Typography>
              )}
              {question?.status === "REWORK" && (
                <Typography
                  variant="body1"
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#f7d1b3", borderRadius: "5px" }}
                >
                  Ответ требует доработки
                </Typography>
              )}

              {/* Текстовое поле для ответа */}
              <TextField
                fullWidth
                multiline
                minRows={4}
                maxRows={10}
                placeholder="Введите ваш ответ здесь..."
                value={answer}
                disabled={
                  lessonStatus !== "STARTED" ||
                  (question.status && question.status !== "REWORK")
                }
                onChange={(e) =>
                  handleAnswerChange(question.position, e.target.value)
                }
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  },
                }}
              />

              {question.reviewComment && (
                <Box bgcolor={"#f0ecc6"} p={2} my={1} borderRadius={1}>
                  <Typography>Комментарий тренера:</Typography>
                  <Typography variant="body2">
                    {question.reviewComment}
                  </Typography>
                </Box>
              )}

              {/* Информация о баллах */}
              {(question.fullPoints || question.partialPoints) && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {question.fullPoints
                      ? `Балл за полный ответ: ${question.fullPoints}`
                      : ""}

                    {question.partialPoints !== undefined
                      ? ` | Балл за частичный ответ: ${question.partialPoints}`
                      : ""}
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
