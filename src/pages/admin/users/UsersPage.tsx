"use client";

import UserTable from "@/features/usersManagement/ui/UsersTable";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import HeaderBox from "@/shared/ui/HeaderBox";
import {
  useGetUsersQuery,
  useSetUsersActivationMutation,
} from "@/entities/user/model/usersApi";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";

export default function UsersPage() {
  const router = useRouter();
  const { currentData: usersInfo } = useGetUsersQuery();

  const [setUsersActivation] = useSetUsersActivationMutation();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Пользователи
        </Typography>
        <Tooltip arrow title={"Создать пользователя"}>
          <IconButton
            onClick={() => {
              router.push(routes.admin.users.createUser);
            }}
          >
            <PersonAddAltRoundedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </HeaderBox>

      <UserTable
        usersInfo={usersInfo || []}
        handleSetActivate={setUsersActivation}
      />
    </Box>
  );
}
