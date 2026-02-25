"use client";

import { UserCreateEditInfo, UserDto } from "@/entities/user/model/types";
import {
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/entities/user/model/usersApi";
import EditUserForm from "@/features/usersManagement/ui/EditUserForm";
import { routes } from "@/shared/config/routes";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditUserPage() {
  const [photo, setPhoto] = useState<File | null>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const formId = "user-edit-form";
  const params = useParams();
  const userId = params?.id as string;
  const router = useRouter();

  // const { currentData: userInfo } = useGetUserQuery(+userId);
  // мок:
  const userInfo: UserDto = {
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
  };

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Редактирование профиля
        </Typography>
        <Button variant="contained" type="submit" form={formId}>
          Сохранить
        </Button>
      </HeaderBox>
      <Box m={"28px"} display={"flex"}>
        <Box>
          <Typography variant="subtitle1" mb={"14px"}>
            Фотография
          </Typography>
          <ImageUpload
            value={photo}
            onChange={setPhoto}
            width="300px"
            height="300px"
          />
        </Box>
        <Box pl={"50px"} flex={1}>
          <EditUserForm
            onSubmit={(userInfo: UserCreateEditInfo) => {
              updateUser({ userId: +userId, updateUserRequest: userInfo });
              //TODO: добавление фото
            }}
            formId={formId}
            isCreation={false}
            isAdmin={true}
            currentValues={userInfo}
          />
          <Box mt={3}>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Удалить
            </Button>
          </Box>
        </Box>
      </Box>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteUser(+userId);
          router.push(routes.admin.users.allUsers);
        }}
        objectname={userInfo.fullName}
        objectType="user"
      />
    </Box>
  );
}
