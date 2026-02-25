"use client";

import { UserCreateEditInfo } from "@/entities/user/model/types";
import { useCreateUserMutation } from "@/entities/user/model/usersApi";
import EditUserForm from "@/features/usersManagement/ui/EditUserForm";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function CreateUserPage() {
  const [photo, setPhoto] = useState<File | null>();
  const formId = "user-create-form";
  const [createUser] = useCreateUserMutation();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Создание пользователя
        </Typography>
        <Button variant="contained" size="large" type="submit" form={formId}>
          Создать
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
              createUser(userInfo);
              //TODO: добавление фото
            }}
            formId={formId}
            isCreation={true}
            isAdmin={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
