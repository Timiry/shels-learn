import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { CourseSummaryDto } from "@/entities/course/model/coursesApi";

interface GroupCoursesTableProps {
  courses: CourseSummaryDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (courses: CourseSummaryDto[]) => {
  return courses.map((course, index) => ({
    id: course.id || index,
    title: course.title,
    lessonsCount:
      (course.theoryLessonsCount || 0) + (course.practiceLessonsCount || 0),
  }));
};

// Определение колонок таблицы
const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Название",
    flex: 1,
    renderCell: (params) => (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
  { field: "lessonsCount", headerName: "Уроков", width: 200 },
];

export default function GroupCoursesTable({
  courses,
  loading = false,
}: GroupCoursesTableProps) {
  const router = useRouter();
  const rows = useMemo(() => prepareRows(courses), [courses]);
  const [searchText, setSearchText] = useState("");
  const quickFilterValues = searchText.trim() ? [searchText] : [];

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
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
        onRowClick={(params, event, details) => {
          router.push(
            routes.admin.courses.courseInfoByIdAndTab(params.id, "description")
          );
        }}
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
              <Typography color="text.secondary">
                Не добавлено курсов
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
