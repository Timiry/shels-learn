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
  PracticeSubmissionRequest,
  SubmitPracticeApiArg,
} from "@/features/student/api/studentApi";

interface LearnTaskLessonFormProps {
  lesson: LearnerLessonDto;
  formId: string;
  onSubmit: (data: SubmitPracticeApiArg) => void;
}

export default function LearnTaskLessonForm({
  lesson,
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
        initialAnswers[question.position.toString()] = [""];
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

    if (!areAllQuestionsAnswered()) {
      alert("Вы ответили не на все вопросы");
      return;
    }

    // Форматируем данные для отправки
    const submissionData: SubmitPracticeApiArg = {
      lessonId: lesson.id,
      practiceSubmissionRequest: {
        questionAnswers: answers, // Используем правильную структуру
      },
    };

    onSubmit(submissionData);
  };

  // Проверка, все ли вопросы имеют ответы (не пустые)
  const areAllQuestionsAnswered = () => {
    if (!lesson.questions) return false;

    return lesson.questions.every((question, index) => {
      const answer = answers[(index + 1).toString()]?.[0] || "";
      return answer.trim().length > 0;
    });
  };

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
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                {`Вопрос № ${question.position + 1}`}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 2, whiteSpace: "pre-wrap" }}
              >
                {question.questionText}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* Текстовое поле для ответа */}
              <TextField
                fullWidth
                multiline
                minRows={4}
                maxRows={10}
                placeholder="Введите ваш ответ здесь..."
                value={answer}
                onChange={(e) =>
                  handleAnswerChange(question.position, e.target.value)
                }
                variant="outlined"
                error={answer.trim().length === 0 && answer.length > 0}
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  },
                }}
              />

              {/* Информация о баллах */}
              {question.fullPoints && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Баллы за верный ответ: {question.fullPoints}
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
