"use client";

import {
  UpdateUserRequest,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/features/student/api/studentApi";
import EditUserForm from "@/features/usersManagement/ui/EditUserForm";
import { useUploadMutation } from "@/shared/api/filesApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Button, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditProfilePage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoWasChange, setPhotoWasChange] = useState<boolean>(false);
  const formId = "user-edit-form";
  const router = useRouter();
  const pathname = usePathname();
  const activeRole = pathname?.includes("admin") ? "ADMIN" : "STUDENT";

  const { currentData: profileInfo } = useMyProfileQuery();

  const [updateProfile] = useUpdateMyProfileMutation();
  const [uploadImage] = useUploadMutation();

  return (
    profileInfo && (
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
              value={
                photo === null
                  ? profileInfo.avatarFilePath
                    ? "http://217.26.31.189" + profileInfo.avatarFilePath
                    : profileInfo.avatarFilePath
                  : photo
              }
              onChange={(file: File) => {
                setPhoto(file);
                setPhotoWasChange(true);
              }}
              width="300px"
              height="300px"
            />
          </Box>
          <Box pl={"50px"} flex={1}>
            <EditUserForm
              onSubmit={async (userInfo: UpdateUserRequest) => {
                if (photoWasChange && photo) {
                  const avatar = await uploadImage({
                    file: photo,
                  }).unwrap();
                  updateProfile({
                    ...userInfo,
                    avatarFilePath: avatar.link,
                  });
                } else await updateProfile(userInfo);

                router.push(
                  activeRole === "ADMIN"
                    ? routes.admin.profile
                    : routes.student.profile
                );
              }}
              formId={formId}
              isCreation={false}
              isAdmin={profileInfo.role === "ADMIN"}
              currentValues={profileInfo}
            />
          </Box>
        </Box>
      </Box>
    )
  );
}
