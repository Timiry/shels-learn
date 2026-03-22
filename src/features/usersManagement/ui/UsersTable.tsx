"use client";

import { DataGrid } from "@mui/x-data-grid/DataGrid";
import {
  GridCallbackDetails,
  GridRowId,
  GridRowSelectionModel,
} from "@mui/x-data-grid/models";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import usersTableColumns from "../model/usersTableColumns";
import { UserDto } from "@/entities/user/model/usersApi";

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
      role: user.role,
      company: company?.title || "-",
      department: department?.title || "-",
      position: position?.title || "-",
      enabled: user.enabled,
      createdAt: user.createdAt,
      lastVisit: user.lastVisit,
    };
  });

const paginationModel = { page: 0, pageSize: 10 };

interface UserToolBar {
  idsCount: number;
  idsToActivate: Set<GridRowId>;
  idsToDeactivate: Set<GridRowId>;
  idsToDelete: Set<GridRowId>;
}

interface UserTableProps {
  usersInfo: UserDto[];
  handleSetActivate: ({
    activate,
    userIds,
  }: {
    activate?: boolean;
    userIds: number[];
  }) => void;
  handleDelete: ({ ids }: { ids: number[] }) => void;
}

export default function UserTable({
  usersInfo,
  handleSetActivate,
  handleDelete,
}: UserTableProps) {
  const emptyToolBar: UserToolBar = {
    idsCount: 0,
    idsToActivate: new Set(),
    idsToDeactivate: new Set(),
    idsToDelete: new Set(),
  };
  const [toolBarState, setToolBarState] = useState<UserToolBar>(emptyToolBar);
  const router = useRouter();

  const usersRows = makeUsersRows(usersInfo);

  const onRowSelectionModeChange = (
    rowSelectionModel: GridRowSelectionModel,
    details: GridCallbackDetails
  ) => {
    if (details.reason === "multipleRowsSelection") {
      if (toolBarState.idsCount === usersRows.length) {
        setToolBarState(emptyToolBar);
      } else {
        const allIds = details.api.getAllRowIds();
        const toActivate = new Set<GridRowId>();
        const toDeactivate = new Set<GridRowId>();
        allIds.forEach((id) => {
          if (details.api.getRow(id).enabled) {
            toDeactivate.add(id);
          } else {
            toActivate.add(id);
          }
        });

        setToolBarState((prev) => ({
          idsCount: allIds.length,
          idsToActivate: toActivate,
          idsToDeactivate: toDeactivate,
          idsToDelete: new Set(allIds),
        }));
      }
    } else {
      const id = [...rowSelectionModel.ids][0];

      if (rowSelectionModel.type === "exclude") {
        const toActivate = toolBarState.idsToActivate;
        const toDeactivate = toolBarState.idsToDeactivate;
        const toDelete = toolBarState.idsToDelete;
        toActivate.delete(id);
        toDeactivate.delete(id);
        toDelete.delete(id);

        setToolBarState((prev) => ({
          idsCount: prev.idsCount - 1,
          idsToActivate: toActivate,
          idsToDeactivate: toDeactivate,
          idsToDelete: toDelete,
        }));
      } else {
        setToolBarState((prev) => ({
          idsCount: prev.idsCount + 1,
          idsToActivate: details.api.getRow(id).enabled
            ? prev.idsToActivate
            : prev.idsToActivate.add(id),
          idsToDeactivate: details.api.getRow(id).enabled
            ? prev.idsToDeactivate.add(id)
            : prev.idsToDeactivate,
          idsToDelete: prev.idsToDelete.add(id),
        }));
      }
    }
  };

  return (
    <Paper
      sx={{
        minHeight: "calc(100vh - 75px)",
        width: "100%",
        p: "28px",
      }}
    >
      {toolBarState?.idsCount > 0 ? (
        <Stack direction={"row"} spacing={2} alignItems={"center"} p={"10px"}>
          <Typography display={"inline"}>
            Выбрано пользователей: {toolBarState?.idsCount}
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              handleSetActivate({
                activate: true,
                userIds: [...toolBarState.idsToActivate].map((id) => +id),
              })
            }
          >
            Активировать ({toolBarState.idsToActivate.size})
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              handleSetActivate({
                activate: true,
                userIds: [...toolBarState.idsToDeactivate].map((id) => +id),
              })
            }
          >
            Деактивировать ({toolBarState.idsToDeactivate.size})
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              handleDelete({
                ids: [...toolBarState.idsToDelete].map((id) => +id),
              })
            }
          >
            Удалить ({toolBarState.idsToDelete.size})
          </Button>
        </Stack>
      ) : (
        <Box height={"57px"} />
      )}

      <DataGrid
        rows={usersRows}
        columns={usersTableColumns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[10, 50, 100]}
        // checkboxSelection
        onRowSelectionModelChange={onRowSelectionModeChange}
        onRowClick={(params, event, details) => {
          router.push(routes.admin.users.userByIdAndTab(params.id, "courses"));
        }}
        columnVisibilityModel={{ id: false, enabled: false }}
        disableColumnMenu={true}
        hideFooterSelectedRowCount={true}
        disableRowSelectionOnClick
        sx={{
          width: "100%",
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
