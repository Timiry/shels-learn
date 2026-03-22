import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { UserDto } from "@/entities/user/model/usersApi";

interface ProgramStatsTableProps {
  students: UserDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (students: UserDto[]) => {
  return students.map((student, index) => ({
    id: student.id || index,
    fullName: student.fullName,
    email: student.email,
  }));
};

// Определение колонок таблицы
const columns: GridColDef[] = [
  {
    field: "fullName",
    headerName: "Пользователь",
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
        <Typography variant="caption">{params.row.email}</Typography>
      </Box>
    ),
  },
];

export default function ProgramStatsTable({
  students,
  loading = false,
}: ProgramStatsTableProps) {
  const router = useRouter();
  const rows = useMemo(() => prepareRows(students), [students]);

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
        onRowClick={(params, event, details) => {
          router.push(routes.admin.users.userByIdAndTag(params.id, "courses"));
        }}
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
                Не зачислено студентов
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
