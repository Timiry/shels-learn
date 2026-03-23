import { Box, Paper, Typography, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { CourseStudentStatDto } from "@/features/statisticsAndReports/api/statisticsAndReportsApi";
import { formatDateTime } from "@/shared/lib/utils/dateTimeFormatting";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";

interface CourseStatsTableProps {
  stats: CourseStudentStatDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (stats: CourseStudentStatDto[]) => {
  return stats.map((stat, index) => ({
    id: stat.studentId || index,
    fullName: stat.fullName,
    earnedPoints: stat.earnedPoints || 0,
    maxPoints: stat.maxPoints || 0,
    efficiencyPercent: stat.efficiencyPercent || 0,
    progressPercent: stat.progressPercent || 0,
    completedLessons: stat.completedLessons || 0,
    totalLessons: stat.totalLessons || 0,
    enrolledAt: formatDateTime(stat.enrolledAt || ""),
    startedAt: formatDateTime(stat.startedAt || ""),
    completedAt: formatDateTime(stat.completedAt || ""),
  }));
};

// Функция для форматирования баллов
const formatPoints = (earned: number, max: number): string => {
  return `${earned} / ${max}`;
};

// Функция для форматирования процентов
const formatPercent = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Определение колонок таблицы
const columns: GridColDef[] = [
  {
    field: "fullName",
    headerName: "ФИО студента",
    flex: 1,
    renderCell: (params) => (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {params.value}
        </Typography>
      </Box>
    ),
  },
  {
    field: "earnedPoints",
    headerName: "Баллов",
    width: 100,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {formatPoints(params.row.earnedPoints, params.row.maxPoints)}
      </Typography>
    ),
  },
  {
    field: "efficiencyPercent",
    headerName: "Эффективность",
    width: 150,
    renderCell: (params) => {
      const value = params.value || 0;
      return (
        <Typography
          variant="body2"
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {formatPercent(value)}
        </Typography>
      );
    },
  },
  {
    field: "progressPercent",
    headerName: "Прогресс",
    width: 100,
    renderCell: (params) => {
      const value = params.value || 0;
      return (
        <Typography
          variant="body2"
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          {formatPercent(value)}
        </Typography>
      );
    },
  },
  {
    field: "enrolledAt",
    headerName: "Назначено",
    width: 140,
  },
  {
    field: "startedAt",
    headerName: "Начало",
    width: 140,
  },
  {
    field: "completedAt",
    headerName: "Завершение",
    width: 140,
  },
];

export default function CourseStatsTable({
  stats,
  loading = false,
}: CourseStatsTableProps) {
  const rows = useMemo(() => prepareRows(stats), [stats]);
  const router = useRouter();

  return (
    <Box sx={{ height: "calc(100vh - 76px)", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
        disableRowSelectionOnClick
        onRowClick={(params, event, details) => {
          router.push(routes.admin.users.userByIdAndTab(params.id, "courses"));
        }}
        disableColumnMenu={true}
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#F2F2F2",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography color="text.secondary">
                Студенты не назначены
              </Typography>
            </Box>
          ),
          noResultsOverlay: () => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography color="text.secondary">
                Не найдено результатов
              </Typography>
            </Box>
          ),
        }}
      />
    </Box>
  );
}
