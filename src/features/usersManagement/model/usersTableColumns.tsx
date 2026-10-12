import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { GridColDef } from "@mui/x-data-grid";

const usersTableColumns: GridColDef[] = [
  {
    field: "fullName",
    headerName: "Пользователь",
    width: 240,
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
    field: "email",
    headerName: "Электронная почта",
    width: 240,
    sortable: false,
  },
  {
    field: "activation",
    headerName: "Активен",
    width: 100,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {params.value ? (
          <CheckRoundedIcon color="primary" />
        ) : (
          <CloseRoundedIcon color="error" />
        )}
      </Box>
    ),
  },
  {
    field: "lastVisit",
    headerName: "Последний визит",
    width: 200,
  },
  {
    field: "role",
    headerName: "Роль",
    width: 200,
    sortable: false,
    valueGetter: (value, row) =>
      value === "ADMIN" ? "Администратор" : "Студент",
  },
  {
    field: "company",
    headerName: "Компания",
    width: 240,
  },
  {
    field: "department",
    headerName: "Подразделение",
    width: 240,
  },
  {
    field: "position",
    headerName: "Должность",
    width: 240,
  },
  {
    field: "createdAt",
    headerName: "Зарегистрирован",
    width: 200,
  },
];

export default usersTableColumns;
