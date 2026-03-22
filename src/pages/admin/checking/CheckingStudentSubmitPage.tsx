// app/admin/checking/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import CheckingSubmitForm from "@/features/statisticsAndReports/ui/CheckingSubmitForm";
import {
  useReviewOpenAnswerMutation,
  usePendingReviewQuestionsQuery,
  PendingSubmissionQuestionDto,
  ReviewQuestionDecisionDto,
  SubmissionQuestionStatus,
  ReviewOpenSubmissionRequest,
} from "@/features/statisticsAndReports/api/statisticsAndReportsApi";

export default function CheckingStudentSubmitPage() {
  const params = useParams();
  const submissionId = params?.id as string;
  const router = useRouter();

  const {
    data: questions,
    isLoading: isFetching,
    error: fetchError,
  } = usePendingReviewQuestionsQuery(Number(submissionId));

  const [reviewSubmission, { isLoading: isReviewing, error: reviewError }] =
    useReviewOpenAnswerMutation();

  const [formError, setFormError] = useState<string | null>(null);

  // Преобразуем данные из апи в формат для формы
  const formattedQuestions: PendingSubmissionQuestionDto[] = questions || [];

  // Обработчик отправки результатов проверки
  const handleReviewSubmit = (
    reviewedQuestions: ReviewOpenSubmissionRequest
  ) => {
    try {
      reviewSubmission({
        submissionId: Number(submissionId),
        reviewOpenSubmissionRequest: reviewedQuestions,
      });

      // Перенаправление после успешной проверки
      router.push(routes.admin.checking.allTasks);
    } catch (err) {
      setFormError(
        (err as any)?.data?.message ||
          (err as any)?.message ||
          "Ошибка при отправке результатов проверки"
      );
    }
  };

  // Обработка ошибок загрузки
  useEffect(() => {
    if (fetchError) {
      setFormError("Ошибка загрузки данных для проверки");
    }
  }, [fetchError]);

  // Обработка ошибок отправки
  useEffect(() => {
    if (reviewError) {
      setFormError(
        (reviewError as any)?.data?.message ||
          "Ошибка при отправке результатов проверки"
      );
    }
  }, [reviewError]);

  if (isFetching && !questions) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (fetchError || !questions) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {formError ||
            "Не удалось загрузить данные для проверки. Попробуйте обновить страницу."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Проверка ответов студента
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}

      <CheckingSubmitForm
        questions={formattedQuestions}
        onSubmit={handleReviewSubmit}
        onCancel={() => router.push(routes.admin.checking.allTasks)}
        isLoading={isReviewing}
      />
    </Box>
  );
}
