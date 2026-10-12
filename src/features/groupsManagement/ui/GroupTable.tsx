import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { GroupDto } from "../api/groupsApi";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";

interface GroupTableProps {
  groups: GroupDto[];
  loading?: boolean;
}

// Функция для формирования строк таблицы
const prepareRows = (groups: GroupDto[]) => {
  return groups.map((group, index) => ({
    id: group.id || index,
    type: group.type,
    title: group.title,
    // studentsCount: group.studentsCount || 0,
    // coursesCount: group.coursesCount || 0,
    // programsCount: group.programsCount || 0,
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
  // {
  //   field: "studentsCount",
  //   headerName: "Студенты",
  //   width: 170,
  // },
  // {
  //   field: "coursesCount",
  //   headerName: "Курсы",
  //   width: 170,
  // },
  // {
  //   field: "programsCount",
  //   headerName: "Программы",
  //   width: 170,
  // },
];

export default function GroupTable({
  groups,
  loading = false,
}: GroupTableProps) {
  const router = useRouter();
  const rows = useMemo(() => prepareRows(groups), [groups]);
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
            routes.admin.groups.groupInfoByIdAndTab(
              params.row.type,
              params.id,
              "students"
            )
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
              <Typography color="text.secondary">Нет групп</Typography>
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
