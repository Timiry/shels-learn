import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { StudentCourseStatDto } from "@/entities/user/model/usersApi";
import { useMemo, useState } from "react";
import { formatDateTime } from "@/shared/lib/utils/dateTimeFormatting";

interface UserStatsTableProps {
  stats: StudentCourseStatDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (stats: StudentCourseStatDto[]) => {
  return stats.map((stat, index) => ({
    id: stat.courseId || index,
    courseTitle: stat.courseTitle || "Без названия",
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
    field: "courseTitle",
    headerName: "Название курса",
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
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
          variant="body1"
          color={value >= 90 ? "#49d227" : value < 70 ? "error" : "#f0c953"}
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

export default function UserStatsTable({
  stats,
  loading = false,
}: UserStatsTableProps) {
  const rows = useMemo(() => prepareRows(stats), [stats]);
  const [searchText, setSearchText] = useState("");
  const quickFilterValues = searchText.trim() ? [searchText] : [];

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TextField
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Поиск"
        size="small"
        sx={{ mb: "20px", width: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon />
            </InputAdornment>
          ),
        }}
      />

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        filterModel={{ items: [], quickFilterValues }}
        onFilterModelChange={(model) =>
          setSearchText(model.quickFilterValues?.join(" ") ?? "")
        }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
        disableRowSelectionOnClick
        disableColumnMenu={true}
        sx={{
          flex: 1,
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
              <Typography color="text.secondary">Курсы не назначены</Typography>
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
