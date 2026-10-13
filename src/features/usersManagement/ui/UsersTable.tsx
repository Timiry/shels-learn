"use client";

import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { GridRowSelectionModel } from "@mui/x-data-grid/models";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import Box from "@mui/material/Box";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import usersTableColumns from "../model/usersTableColumns";
import { UserDto } from "@/entities/user/model/usersApi";
import { formatDateTime } from "@/shared/lib/utils/dateTimeFormatting";

const makeUsersRows = (users: UserDto[]) =>
  users.map((user) => {
    const company = user?.groups?.find((group) => group.type === "COMPANY");
    const department = user?.groups?.find(
      (group) => group.type === "DEPARTMENT"
    );
    const position = user?.groups?.find((group) => group.type === "POSITION");
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      activation: user.activation,
      role: user.role,
      company: company?.title || "-",
      department: department?.title || "-",
      position: position?.title || "-",
      enabled: user.enabled,
      createdAt: formatDateTime(user.createdAt || ""),
      lastVisit: formatDateTime(user.lastVisit || ""),
    };
  });

const paginationModel = { page: 0, pageSize: 10 };

const emptySelectionModel: GridRowSelectionModel = {
  type: "include",
  ids: new Set(),
};

interface UserTableProps {
  usersInfo: UserDto[];
  handleSetActivate: ({
    activate,
    userIds,
  }: {
    activate?: boolean;
    userIds: number[];
  }) => void;
}

export default function UserTable({
  usersInfo,
  handleSetActivate,
}: UserTableProps) {
  const [selectionModel, setSelectionModel] =
    useState<GridRowSelectionModel>(emptySelectionModel);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const usersRows = makeUsersRows(usersInfo);
  const quickFilterValues = searchText.trim() ? [searchText] : [];

  const selectedRows = usersRows.filter((row) =>
    selectionModel.type === "exclude"
      ? !selectionModel.ids.has(row.id)
      : selectionModel.ids.has(row.id)
  );
  const selectedActiveIds = selectedRows
    .filter((row) => row.activation)
    .map((row) => row.id);
  const selectedInactiveIds = selectedRows
    .filter((row) => !row.activation)
    .map((row) => row.id);

  return (
    <Paper
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        p: "28px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {selectedRows.length > 0 ? (
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          sx={{ mb: "20px" }}
        >
          <Typography>Выбрано: {selectedRows.length}</Typography>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedInactiveIds.length === 0}
            onClick={() =>
              handleSetActivate({
                activate: true,
                userIds: selectedInactiveIds,
              })
            }
          >
            Активировать ({selectedInactiveIds.length})
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={selectedActiveIds.length === 0}
            onClick={() =>
              handleSetActivate({ activate: false, userIds: selectedActiveIds })
            }
          >
            Деактивировать ({selectedActiveIds.length})
          </Button>
        </Stack>
      ) : (
        <Box height={"57px"} />
      )}

      <TextField
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Поиск пользователей"
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
        rows={usersRows}
        columns={usersTableColumns}
        initialState={{ pagination: { paginationModel } }}
        filterModel={{ items: [], quickFilterValues }}
        onFilterModelChange={(model) =>
          setSearchText(model.quickFilterValues?.join(" ") ?? "")
        }
        pageSizeOptions={[10, 50, 100]}
        checkboxSelection
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newSelection) =>
          setSelectionModel(newSelection)
        }
        onRowClick={(params, event, details) => {
          router.push(routes.admin.users.userByIdAndTab(params.id, "courses"));
        }}
        columnVisibilityModel={{ id: false, enabled: false }}
        disableColumnMenu={true}
        hideFooterSelectedRowCount={true}
        disableRowSelectionOnClick
        sx={{
          flex: 1,
          maxWidth: "100%",
          overflowX: "auto",
          border: 0,
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#F2F2F2",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },
        }}
      />
    </Paper>
  );
}
