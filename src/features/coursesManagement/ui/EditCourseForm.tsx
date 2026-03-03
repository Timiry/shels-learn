"use client";

import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Stack, MenuItem } from "@mui/material";
import { CourseDto, CreateCourseRequest } from "@/entities/course/model/types";

interface EditCourseFormProps {
  onSubmit: (courseInfo: CreateCourseRequest) => void;
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
  } = useForm<CreateCourseRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          description: "",
          authorFullName: "",
          passingThresholdPercent: 100,
        }
      : {
          title: currentValues?.title,
          description: currentValues?.description,
          authorFullName: currentValues?.authorFullName,
          passingThresholdPercent: currentValues?.passingThresholdPercent,
        },
  });

  const onSubmitForm = (courseInfo: CreateCourseRequest) => {
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
          {...register("description")}
          placeholder="Описание"
          fullWidth
          multiline
          rows={8}
        />

        <Typography variant="body1">Автор курса</Typography>
        <TextField
          {...register("authorFullName")}
          placeholder="Автор курса"
          fullWidth
        />

        <Typography variant="body1">Порог прохождения</Typography>
        <TextField
          {...register("passingThresholdPercent", {
            valueAsNumber: true,
          })}
          select
          helperText={
            "Выберите минимальный процент для успешного прохождения курса"
          }
          defaultValue={90}
          sx={{ maxWidth: 400 }}
        >
          <MenuItem value={50}>50%</MenuItem>
          <MenuItem value={60}>60%</MenuItem>
          <MenuItem value={70}>70%</MenuItem>
          <MenuItem value={80}>80%</MenuItem>
          <MenuItem value={90}>90%</MenuItem>
          <MenuItem value={100}>100%</MenuItem>
        </TextField>
      </Stack>
    </Box>
  );
}
