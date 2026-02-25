import { GridColDef } from "@mui/x-data-grid";

const usersTableColumns: GridColDef[] = [
  { field: "id" },
  { field: "enabled" },
  {
    field: "fullName",
    headerName: "Пользователь",
    width: 240,
  },
  {
    field: "email",
    headerName: "Электронная почта",
    width: 240,
    sortable: false,
  },
  {
    field: "lastVisit",
    headerName: "Последний визит",
    width: 240,
  },
  {
    field: "role",
    headerName: "Роль",
    width: 240,
    sortable: false,
    valueGetter: (value, row) =>
      value === "ADMIN" ? "Администратор" : "Студент",
  },
  {
    field: "createdAt",
    headerName: "Зарегистрирован",
    width: 240,
  },
];

export default usersTableColumns;
