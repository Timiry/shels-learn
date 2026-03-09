"use client";

import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import SubmissionsTable from "@/features/statisticsAndReports/ui/SubmissionsTable";
import HeaderBox from "@/shared/ui/HeaderBox";
import { usePendingReviewsQuery } from "@/features/statisticsAndReports/api/statisticsAndReportsApi";

export default function CheckingPage() {
  const {
    currentData: submissions,
    isLoading,
    error,
  } = usePendingReviewsQuery();

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Ошибка загрузки данных:{" "}
          {(error as any)?.data?.message || "Неизвестная ошибка"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" gutterBottom>
          Ответы студентов для проверки
        </Typography>
      </HeaderBox>

      {isLoading && !submissions ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <SubmissionsTable submissions={submissions || []} loading={isLoading} />
      )}
    </Box>
  );
}
