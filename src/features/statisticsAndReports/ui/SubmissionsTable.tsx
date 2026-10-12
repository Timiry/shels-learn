// features/submissions/ui/SubmissionsTable.tsx
import { routes } from "@/shared/config/routes";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PendingSubmissionDto } from "../api/statisticsAndReportsApi";

interface SubmissionsTableProps {
  submissions: PendingSubmissionDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (submissions: PendingSubmissionDto[]) => {
  return submissions.map((submission) => ({
    id: submission.submissionId,
    studentFullname: submission.studentFullname,
    courseTitle: submission.courseTitle,
    lessonTitle: submission.lessonTitle,
  }));
};

// Определение колонок таблицы
const columns: GridColDef[] = [
  {
    field: "studentFullname",
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
    field: "courseTitle",
    headerName: "Курс",
    width: 300,
    renderCell: (params) => (
      <Tooltip title={params.value}>
        <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      </Tooltip>
    ),
  },
  {
    field: "lessonTitle",
    headerName: "Урок",
    width: 320,
    renderCell: (params) => (
      <Tooltip title={params.value}>
        <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.value}
          </Typography>
        </Box>
      </Tooltip>
    ),
  },
];

export default function SubmissionsTable({
  submissions,
  loading = false,
}: SubmissionsTableProps) {
  const rows = useMemo(() => prepareRows(submissions), [submissions]);
  const [searchText, setSearchText] = useState("");
  const quickFilterValues = searchText.trim() ? [searchText] : [];
  const router = useRouter();

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        p: "28px",
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
        filterModel={{ items: [], quickFilterValues }}
        onFilterModelChange={(model) =>
          setSearchText(model.quickFilterValues?.join(" ") ?? "")
        }
        onRowClick={(params, event, details) => {
          router.push(routes.admin.checking.checkTaskById(params.id));
        }}
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
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
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
                Нет заданий для проверки
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
