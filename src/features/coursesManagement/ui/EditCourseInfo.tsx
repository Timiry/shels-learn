"use client";

import {
  CreateCourseRequest,
  UpdateCourseApiArg,
  CourseDto,
} from "@/entities/course/model/types";
import { routes } from "@/shared/config/routes";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Typography, Stack, Button } from "@mui/material";
import EditCourseForm from "./EditCourseForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadMutation } from "@/shared/api/filesApi";

interface EditCourseInfoProps {
  courseInfo: CourseDto;
  onUpdate: (arg: UpdateCourseApiArg) => {};
  onDelete: (id: number) => void;
}

export default function EditCourseInfo({
  courseInfo,
  onUpdate,
  onDelete,
}: EditCourseInfoProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoWasChange, setPhotoWasChange] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [uploadImage] = useUploadMutation();

  const router = useRouter();
  const formId = "course-update-form";
  return (
    <Box m={"28px"} display={"flex"}>
      <Box>
        <Typography variant="body1" mb={2}>
          Обложка
        </Typography>
        <ImageUpload
          value={photo === null ? courseInfo.coverFilePath : photo}
          onChange={(file: File) => {
            setPhoto(file);
            setPhotoWasChange(true);
          }}
          width="300px"
          height="300px"
          isCover={true}
        />
      </Box>
      <Box pl={"50px"} flex={1}>
        <EditCourseForm
          onSubmit={async (course: CreateCourseRequest) => {
            if (photoWasChange && photo) {
              const cover = await uploadImage({
                file: photo,
              }).unwrap();
              await onUpdate({
                courseId: courseInfo.id,
                createCourseRequest: {
                  ...course,
                  coverFilePath: cover.link,
                },
              });
            } else {
              await onUpdate({
                courseId: courseInfo.id,
                createCourseRequest: course,
              });
            }
            router.push(routes.admin.courses.courseById(courseInfo.id));
          }}
          formId={formId}
          isCreation={false}
          currentValues={courseInfo}
        />
        <Stack spacing={3} direction={"row"} justifyContent={"flex-end"} mt={3}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            form={formId}
            sx={{ mr: 5 }}
          >
            Сохранить
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Удалить
          </Button>
        </Stack>
      </Box>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          onDelete(courseInfo?.id);
          router.push(routes.admin.courses.allCourses);
        }}
        objectname={courseInfo.title}
        objectType="course"
      />
    </Box>
  );
}
