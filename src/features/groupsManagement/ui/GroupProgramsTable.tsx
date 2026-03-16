import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { LearningProgramDto } from "../api/groupsApi";

interface GroupProgramsTableProps {
  programs: LearningProgramDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (programs: LearningProgramDto[]) => {
  return programs.map((program, index) => ({
    id: program.id || index,
    title: program.title,
    coursesCount: program.courses.length,
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
  { field: "coursesCount", headerName: "Курсов", width: 200 },
];

export default function GroupProgramsTable({
  programs,
  loading = false,
}: GroupProgramsTableProps) {
  const router = useRouter();
  const rows = useMemo(() => prepareRows(programs), [programs]);

  return (
    <Box sx={{ width: "100%" }}>
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
        pageSizeOptions={[5, 10, 25, 50]}
        disableRowSelectionOnClick
        disableColumnMenu={true}
        // onRowClick={(params, event, details) => {  //TODO: сделать ссылку на программу по id
        //   router.push();
        // }}
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
