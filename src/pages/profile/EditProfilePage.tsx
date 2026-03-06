"use client";

import {
  UpdateMyProfileRequest,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/features/student/api/studentApi";
import EditUserForm from "@/features/usersManagement/ui/EditUserForm";
import { useUploadMutation } from "@/shared/api/filesApi";
import { routes } from "@/shared/config/routes";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Button, Typography } from "@mui/material";
import { useParams, usePathname } from "next/navigation";
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
                  ? profileInfo.user.avatarFilePath
                    ? process.env.NEXT_PUBLIC_API_URL +
                      profileInfo.user.avatarFilePath
                    : profileInfo.user.avatarFilePath
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
              onSubmit={async (userInfo: UpdateMyProfileRequest) => {
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
              isAdmin={profileInfo.user.role === "ADMIN"}
              currentValues={profileInfo.user}
            />
          </Box>
        </Box>
      </Box>
    )
  );
}
