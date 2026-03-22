import { Box, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { ProgramSummaryDto } from "../api/groupsApi";

interface GroupProgramsTableProps {
  programs: ProgramSummaryDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (programs: ProgramSummaryDto[]) => {
  return programs.map((program, index) => ({
    id: program.id || index,
    title: program.title,
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
        pageSizeOptions={[10, 50, 100]}
        disableRowSelectionOnClick
        disableColumnMenu={true}
        onRowClick={(params, event, details) => {
          router.push(
            routes.admin.programs.programInfoByIdAndTab(
              params.id,
              "description"
            )
          );
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
                Не добавлено программ
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
