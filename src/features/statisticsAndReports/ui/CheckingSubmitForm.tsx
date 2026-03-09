// features/statisticsAndReports/ui/CheckingSubmitForm.tsx
"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Paper,
  Divider,
  Grid,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  PendingSubmissionQuestionDto,
  SubmissionQuestionStatus,
} from "@/features/statisticsAndReports/api/statisticsAndReportsApi";

interface CheckingSubmitFormProps {
  questions: PendingSubmissionQuestionDto[];
  onSubmit: (reviewedQuestions: PendingSubmissionQuestionDto[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CheckingSubmitForm({
  questions,
  onSubmit,
  onCancel,
  isLoading = false,
}: CheckingSubmitFormProps) {
  const [reviewedQuestions, setReviewedQuestions] = useState<
    PendingSubmissionQuestionDto[]
  >([]);
  const [formError, setFormError] = useState<string | null>(null);

  // Инициализация состояния из пропсов
  useEffect(() => {
    setReviewedQuestions(questions.map((q) => ({ ...q })));
  }, [questions]);

  // Обработчик изменения статуса вопроса
  const handleStatusChange = (
    questionIndex: number,
    status: SubmissionQuestionStatus
  ) => {
    if (status === "REJECTED" || "REWORK")
      handlePointsChange(questionIndex, "0");

    setReviewedQuestions((prev) =>
      prev.map((q) =>
        q.questionIndex === questionIndex
          ? { ...q, submissionStatus: status }
          : q
      )
    );
  };

  // Обработчик изменения комментария
  const handleCommentChange = (questionIndex: number, comment: string) => {
    setReviewedQuestions((prev) =>
      prev.map((q) =>
        q.questionIndex === questionIndex ? { ...q, reviewComment: comment } : q
      )
    );
  };

  // Обработчик изменения баллов
  const handlePointsChange = (questionIndex: number, value: string) => {
    const points = parseInt(value);

    // Валидация: не больше максимальных баллов и не меньше 0
    if (isNaN(points) || points < 0) {
      return;
    }

    const question = reviewedQuestions.find(
      (q) => q.questionIndex === questionIndex
    );
    if (!question || !question.fullPoints) return;

    if (points > question.fullPoints) {
      return; // Не позволяем вводить больше максимальных баллов
    }

    setReviewedQuestions((prev) =>
      prev.map((q) =>
        q.questionIndex === questionIndex ? { ...q, awardedPoints: points } : q
      )
    );
  };

  // Проверка, все ли вопросы проверены
  const areAllQuestionsReviewed = () => {
    return reviewedQuestions.every(
      (q) => q.submissionStatus && q.submissionStatus !== "PENDING_REVIEW"
    );
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    if (!areAllQuestionsReviewed()) {
      setFormError(
        "Не все вопросы проверены. Пожалуйста, установите статус для каждого вопроса."
      );
      return;
    }

    setFormError(null);
    onSubmit(reviewedQuestions);
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Stack spacing={3}>
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        {reviewedQuestions.map((question) => {
          if (question.questionIndex === undefined) return null;

          return (
            <Paper
              key={question.questionIndex}
              sx={{
                p: 3,
                borderRadius: 2,
                transition: "all 0.2s",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Вопрос №{question.questionIndex}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  {question.questionText || "Без текста вопроса"}
                </Typography>

                {question.trainerHint && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      bgcolor: "background.default",
                      borderRadius: 1,
                      borderLeft: "3px solid",
                      borderColor: "primary.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      Подсказка для тренера:
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                      {question.trainerHint}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Ответ студента:
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    minHeight: 80,
                  }}
                >
                  <Typography variant="body1" whiteSpace="pre-wrap">
                    {question.answer || "Студент не предоставил ответ"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Статус проверки:
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid>
                    <Button
                      variant={
                        question.submissionStatus === "ACCEPTED"
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      onClick={() =>
                        handleStatusChange(question.questionIndex!, "ACCEPTED")
                      }
                      sx={{
                        minWidth: 130,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Принять
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      variant={
                        question.submissionStatus === "REWORK"
                          ? "contained"
                          : "outlined"
                      }
                      color={"warning"}
                      onClick={() =>
                        handleStatusChange(question.questionIndex!, "REWORK")
                      }
                      sx={{
                        minWidth: 130,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      На доработку
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      variant={
                        question.submissionStatus === "REJECTED"
                          ? "contained"
                          : "outlined"
                      }
                      color={"error"}
                      onClick={() =>
                        handleStatusChange(question.questionIndex!, "REJECTED")
                      }
                      sx={{
                        minWidth: 130,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Отклонить
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {question.submissionStatus === "ACCEPTED" && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Баллы:
                  </Typography>
                  <TextField
                    type="number"
                    fullWidth
                    value={question.awardedPoints ?? 0}
                    onChange={(e) =>
                      handlePointsChange(
                        question.questionIndex!,
                        e.target.value
                      )
                    }
                    inputProps={{
                      min: 0,
                      max: question.fullPoints,
                      step: 1,
                    }}
                    placeholder="Введите количество баллов"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: "background.paper",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="body2" color="text.secondary">
                            / {question.fullPoints}
                          </Typography>
                        </InputAdornment>
                      ),
                    }}
                    helperText={`Максимум ${question.fullPoints} баллов`}
                  />
                </Box>
              )}

              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Комментарий тренера:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  placeholder="Введите комментарий для студента..."
                  value={question.reviewComment || ""}
                  onChange={(e) =>
                    handleCommentChange(question.questionIndex!, e.target.value)
                  }
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: "background.paper",
                    },
                  }}
                />
              </Box>
            </Paper>
          );
        })}

        {/* Кнопки действий */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isLoading}
            sx={{
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !areAllQuestionsReviewed()}
            sx={{
              px: 3,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Отправка...
              </Box>
            ) : (
              "Отправить"
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
