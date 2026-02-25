"use client";

import { UserDto } from "@/entities/user/model/types";
import UserTable from "@/features/usersManagement/ui/UsersTable";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import HeaderBox from "@/shared/ui/HeaderBox";
import {
  useDeleteUsersMutation,
  useGetUsersQuery,
  useSetUsersActivationMutation,
} from "@/entities/user/model/usersApi";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";

export default function UsersPage() {
  const router = useRouter();
  // const { currentData: usersInfo } = useGetUsersQuery();
  // мок:
  const usersInfo: UserDto[] = [
    {
      id: 1,
      fullName: "Иванов Иван Иванович",
      email: "ivanov@example.com",
      role: "ADMIN",
      enabled: true,
      phone: "+7 (999) 123-45-67",
      comment: "eeeeee",
      createdAt: "2024-01-15T10:30:00Z",
      createdBy: "Петров Петр Петрович",
      lastVisit: "2024-02-17T14:25:33Z",
      deactivatedAt: undefined,
      deactivatedBy: undefined,
    },
    {
      id: 2,
      fullName: "Иванов Иван Иванович",
      email: "ivanov@example.com",
      role: "STUDENT",
      enabled: true,
      phone: "+7 (999) 123-45-67",
      comment: "",
      createdAt: "2024-01-15T10:30:00Z",
      createdBy: "admin@example.com",
      lastVisit: "2024-02-17T14:25:33Z",
      deactivatedAt: undefined,
      deactivatedBy: undefined,
    },
    {
      id: 3,
      fullName: "Иванов Иван Иванович",
      email: "ivanov@example.com",
      role: "STUDENT",
      enabled: true,
      phone: "+7 (999) 123-45-67",
      comment: "",
      createdAt: "2024-01-15T10:30:00Z",
      createdBy: "admin@example.com",
      lastVisit: "2024-02-17T14:25:33Z",
      deactivatedAt: undefined,
      deactivatedBy: undefined,
    },
  ];
  const [setUsersActivation] = useSetUsersActivationMutation();
  const [deleteUsers] = useDeleteUsersMutation();

  return (
    <Box>
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
        usersInfo={usersInfo}
        handleSetActivate={setUsersActivation}
        handleDelete={deleteUsers}
      />
    </Box>
  );
}
