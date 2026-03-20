"use client";

import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
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

interface LearnTestLessonFormProps {
  lesson: LearnerLessonDto;
  lessonStatus?: LessonProgressStatus;
  formId: string;
  onSubmit: (data: SubmitPracticeApiArg) => void;
}

export default function LearnTestLessonForm({
  lesson,
  lessonStatus,
  formId,
  onSubmit,
}: LearnTestLessonFormProps) {
  const [answers, setAnswers] = useState<{ [key: string]: string[] }>({});

  // Инициализация состояния ответов
  useEffect(() => {
    if (lesson.questions) {
      const initialAnswers: { [key: string]: string[] } = {};
      lesson.questions.forEach((question) => {
        initialAnswers[question.id.toString()] =
          lessonStatus === "STARTED" ? [] : question.userAnswers || [];
      });
      setAnswers(initialAnswers);
    }
  }, [lesson.questions]);

  // Обработчик выбора ответа для одиночного выбора
  const handleSingleChoiceChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: [answer],
    }));
  };

  // Обработчик выбора ответа для множественного выбора
  const handleMultipleChoiceChange = (
    questionIndex: number,
    answer: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionIndex.toString()] || [];

      if (checked) {
        // Добавляем ответ, если его нет в массиве
        if (!currentAnswers.includes(answer)) {
          return {
            ...prev,
            [questionIndex]: [...currentAnswers, answer],
          };
        }
      } else {
        // Удаляем ответ из массива
        return {
          ...prev,
          [questionIndex]: currentAnswers.filter((a) => a !== answer),
        };
      }

      return prev;
    });
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
        questionAnswers: answers,
        submittedAt: Date.now(),
      },
    };

    onSubmit(submissionData);
  };

  // // Проверка, все ли вопросы имеют ответы
  // const areAllQuestionsAnswered = () => {
  //   if (!lesson.questions) return false;

  //   return lesson.questions.every((question, index) => {
  //     const questionAnswers = answers[(index + 1).toString()] || [];
  //     return questionAnswers.length > 0;
  //   });
  // };

  if (!lesson.questions || lesson.questions.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        В этом уроке нет вопросов для теста.
      </Alert>
    );
  }

  return (
    <Box component="form" id={formId} onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {/* Вопросы */}
        {lesson.questions.map((question) => (
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
              {lessonStatus && lessonStatus !== "STARTED" && (
                <LessonOption
                  name="Получено баллов"
                  value={`${question.awardedPoints} из ${question.fullPoints}`}
                />
              )}
            </Box>
            <Typography variant="body2">{question.questionText}</Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Варианты ответа */}
            {question.questionType === "SINGLE_CHOICE" ? (
              // Радиогруппа для одиночного выбора
              <RadioGroup
                value={answers[question.position.toString()]?.[0] || ""}
                onChange={(e) =>
                  handleSingleChoiceChange(question.position, e.target.value)
                }
              >
                {question.options?.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={option}
                    disabled={lessonStatus !== "STARTED"}
                    control={<Radio />}
                    label={option}
                    sx={{
                      mb: 1,
                      bgcolor:
                        lessonStatus === "COMPLETED" &&
                        question.correctAnswers?.includes(option)
                          ? "success.light"
                          : "inherit",
                      borderRadius: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            ) : question.questionType === "MULTIPLE_CHOICE" ? (
              // Чекбоксы для множественного выбора
              <Box>
                {question.options?.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    disabled={lessonStatus !== "STARTED"}
                    control={
                      <Checkbox
                        checked={
                          answers[question.position.toString()]?.includes(
                            option
                          ) || false
                        }
                        onChange={(e) =>
                          handleMultipleChoiceChange(
                            question.position,
                            option,
                            e.target.checked
                          )
                        }
                      />
                    }
                    label={option}
                    sx={{
                      mb: 1,
                      width: "100%",
                      bgcolor:
                        lessonStatus === "COMPLETED" &&
                        question.correctAnswers?.includes(option)
                          ? "success.light"
                          : "inherit",
                      borderRadius: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                ))}
              </Box>
            ) : (
              // Заглушка для других типов вопросов
              <Alert severity="info">
                Тип вопроса "{question.questionType}" пока не поддерживается
              </Alert>
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
        ))}
      </Stack>
    </Box>
  );
}
