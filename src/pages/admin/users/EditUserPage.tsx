"use client";

import {
  UpdateUserRequest,
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/entities/user/model/usersApi";
import EditUserForm from "@/features/usersManagement/ui/EditUserForm";
import { routes } from "@/shared/config/routes";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditUserPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const formId = "user-edit-form";
  const params = useParams();
  const userId = params?.id as string;
  const router = useRouter();

  const { currentData: userInfo } = useGetUserQuery(+userId);

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  return (
    userInfo && (
      <Box>
        <HeaderBox>
          <Typography variant="h1" display={"inline"}>
            Редактирование профиля
          </Typography>
          <Button variant="contained" type="submit" form={formId}>
            Сохранить
          </Button>
        </HeaderBox>
        <Box m={"28px"} display="flex" justifyContent="center">
          <Box width="70%">
            <EditUserForm
              onSubmit={async (userInfo: UpdateUserRequest) => {
                await updateUser({
                  userId: +userId,
                  updateUserRequest: userInfo,
                });
                router.push(
                  routes.admin.users.userByIdAndTab(userId, "courses")
                );
              }}
              formId={formId}
              isCreation={false}
              isAdmin={true}
              currentValues={userInfo}
            />
            <Box mt={3} display="flex" justifyContent={"flex-end"}>
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
          objectname={userInfo.fullName || ""}
          objectType="user"
        />
      </Box>
    )
  );
}
