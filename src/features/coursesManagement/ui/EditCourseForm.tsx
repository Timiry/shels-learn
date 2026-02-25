"use client";

import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Stack } from "@mui/material";
import { CourseCreateEditInfo, CourseDto } from "@/entities/course/model/types";

interface EditCourseFormProps {
  onSubmit: (userInfo: CourseCreateEditInfo) => void;
  formId: string;
  isCreation: boolean;
  currentValues?: CourseDto;
}

export default function EditCourseForm({
  onSubmit,
  formId,
  isCreation,
  currentValues,
}: EditCourseFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseCreateEditInfo>({
    defaultValues: isCreation
      ? {
          title: "",
          discription: "",
        }
      : {
          title: currentValues?.title,
          discription: currentValues?.discription,
        },
  });

  const onSubmitForm = (courseInfo: CourseCreateEditInfo) => {
    if (courseInfo.title === "") {
      setError("title", { message: "Название должно быть заполнено" });
      return;
    }
    onSubmit(courseInfo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} id={formId}>
      <Stack spacing={2}>
        <Typography variant="body1">Название</Typography>
        <TextField
          {...register("title")}
          placeholder="Название"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <Typography variant="body1">Описание</Typography>
        <TextField
          {...register("discription")}
          placeholder="Описание"
          fullWidth
          multiline
          rows={8}
        />
      </Stack>
    </Box>
  );
}
