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
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import {
  PendingSubmissionQuestionDto,
  ReviewOpenSubmissionRequest,
  ReviewPointsType,
  ReviewQuestionDecisionDto,
  SubmissionQuestionStatus,
} from "@/features/statisticsAndReports/api/statisticsAndReportsApi";

interface CheckingSubmitFormProps {
  questions: PendingSubmissionQuestionDto[];
  onSubmit: (reviewedQuestions: ReviewOpenSubmissionRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function CheckingSubmitForm({
  questions,
  onSubmit,
  onCancel,
  isLoading = false,
}: CheckingSubmitFormProps) {
  const [reviewedQuestions, setReviewedQuestions] = useState<{
    [key: string]: ReviewQuestionDecisionDto;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!questions || questions.length === 0) return;

    const initialReviews: { [key: string]: ReviewQuestionDecisionDto } = {};
    questions.forEach((question) => {
      const questionIdStr = question.questionId.toString();

      initialReviews[questionIdStr] = {
        submissionStatus: question.submissionStatus || "PENDING_REVIEW",
        pointsType: question.submissionStatus === "ACCEPTED" ? "FULL" : null,
        reviewComment: question.reviewComment || "",
      };
    });

    setReviewedQuestions(initialReviews);
  }, [questions]);

  const handleStatusChange = useCallback(
    (questionId: number, status: SubmissionQuestionStatus) => {
      const questionIdStr = questionId.toString();

      setReviewedQuestions((prev) => {
        const currentReview = prev[questionIdStr] || {
          submissionStatus: "PENDING_REVIEW",
          pointsType: null,
          reviewComment: "",
        };

        return {
          ...prev,
          [questionIdStr]: {
            ...currentReview,
            submissionStatus: status,
            pointsType: status === "ACCEPTED" ? "FULL" : null,
          },
        };
      });
    },
    []
  );

  const handleCommentChange = useCallback(
    (questionId: number, comment: string) => {
      const questionIdStr = questionId.toString();

      setReviewedQuestions((prev) => ({
        ...prev,
        [questionIdStr]: {
          ...prev[questionIdStr],
          reviewComment: comment,
        },
      }));
    },
    []
  );

  const handlePointsChange = useCallback(
    (questionId: number, value: ReviewPointsType) => {
      const questionIdStr = questionId.toString();

      setReviewedQuestions((prev) => ({
        ...prev,
        [questionIdStr]: {
          ...prev[questionIdStr],
          pointsType: value,
        },
      }));
    },
    []
  );

  const areAllQuestionsReviewed = useCallback(() => {
    if (questions.length === 0) return false;

    return questions.every((question) => {
      const questionIdStr = question.questionId.toString();
      const review = reviewedQuestions[questionIdStr];

      return review && review.submissionStatus !== "PENDING_REVIEW";
    });
  }, [questions, reviewedQuestions]);

  const handleSubmit = useCallback(() => {
    if (!areAllQuestionsReviewed()) {
      setFormError(
        "Не все вопросы проверены. Пожалуйста, установите статус для каждого вопроса."
      );
      return;
    }

    setFormError(null);
    onSubmit({ questionReviews: reviewedQuestions });
  }, [reviewedQuestions, areAllQuestionsReviewed, onSubmit]);

  if (questions.length === 0 || Object.keys(reviewedQuestions).length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Stack spacing={3}>
        {questions.map((question) => (
          <Paper
            key={question.questionId}
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
                      reviewedQuestions[question.questionId]
                        .submissionStatus === "ACCEPTED"
                        ? "contained"
                        : "outlined"
                    }
                    color="primary"
                    onClick={() =>
                      handleStatusChange(question.questionId, "ACCEPTED")
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
                      reviewedQuestions[question.questionId]
                        .submissionStatus === "REWORK"
                        ? "contained"
                        : "outlined"
                    }
                    color={"warning"}
                    onClick={() =>
                      handleStatusChange(question.questionId, "REWORK")
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
                      reviewedQuestions[question.questionId]
                        .submissionStatus === "REJECTED"
                        ? "contained"
                        : "outlined"
                    }
                    color={"error"}
                    onClick={() =>
                      handleStatusChange(question.questionId, "REJECTED")
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

            {reviewedQuestions[question.questionId].submissionStatus ===
              "ACCEPTED" && (
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Баллы:
                </Typography>
                <RadioGroup
                  value={reviewedQuestions[question.questionId].pointsType}
                  onChange={(e) =>
                    handlePointsChange(
                      question.questionId,
                      e.target.value as ReviewPointsType
                    )
                  }
                >
                  <FormControlLabel
                    key={"FULL"}
                    value={"FULL"}
                    control={<Radio />}
                    label={"Полный балл"}
                    sx={{
                      mb: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                  <FormControlLabel
                    key={"PARTIAL"}
                    value={"PARTIAL"}
                    control={<Radio />}
                    label={"Частичный балл"}
                    sx={{
                      mb: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                  <FormControlLabel
                    key={"ZERO"}
                    value={"ZERO"}
                    control={<Radio />}
                    label={"0 баллов"}
                    sx={{
                      mb: 1,
                      "& .MuiFormControlLabel-label": {
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                </RadioGroup>
              </Box>
            )}

            {reviewedQuestions[question.questionId].submissionStatus ===
              "REJECTED" && (
              <Alert severity="info" sx={{ my: 2 }}>
                Обратите внимание, что при отклонении любого ответа на вопрос
                весь урок будет считаться проваленным, из-за чего студент не
                сможет завершить курс успешно
              </Alert>
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
                value={
                  reviewedQuestions[question.questionId].reviewComment || ""
                }
                onChange={(e) =>
                  handleCommentChange(question.questionId, e.target.value)
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
        ))}

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

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
