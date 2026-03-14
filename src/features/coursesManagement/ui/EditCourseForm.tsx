"use client";

import { Controller, useForm } from "react-hook-form";
import { Box, Typography, TextField, Stack, MenuItem } from "@mui/material";
import { CourseDto, CreateCourseRequest } from "@/entities/course/model/types";
import { SectionDto } from "@/entities/section/model/sectionsApi";

interface EditCourseFormProps {
  onSubmit: (courseInfo: CreateCourseRequest) => void;
  formId: string;
  isCreation: boolean;
  currentValues?: CourseDto;
  sections?: SectionDto[];
  sectionIdForCreation?: number;
}

export default function EditCourseForm({
  onSubmit,
  formId,
  isCreation,
  currentValues,
  sections,
  sectionIdForCreation,
}: EditCourseFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<CreateCourseRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          description: "",
          authorFullName: "",
          passingThresholdPercent: 90,
          sectionId: sectionIdForCreation || 1,
        }
      : {
          title: currentValues?.title,
          description: currentValues?.description,
          authorFullName: currentValues?.authorFullName,
          passingThresholdPercent: currentValues?.passingThresholdPercent,
          sectionId: currentValues?.sectionId,
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

        <Typography variant="body1">Раздел курса</Typography>
        <Controller
          name="sectionId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              fullWidth
              helperText={"Раздел, в котором будет находиться курс"}
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              {!sections || sections.length === 0 ? (
                <MenuItem value="" disabled>
                  Нет доступных разделов
                </MenuItem>
              ) : (
                sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.title}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        />

        <Typography variant="body1">Автор курса</Typography>
        <TextField
          {...register("authorFullName")}
          placeholder="Автор курса"
          fullWidth
        />

        <Typography variant="body1">Порог прохождения</Typography>
        <Controller
          name="passingThresholdPercent"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              sx={{ maxWidth: 400 }}
              helperText={
                "Выберите минимальный процент для успешного прохождения курса"
              }
              onChange={(e) => field.onChange(Number(e.target.value))}
            >
              <MenuItem value={50}>50%</MenuItem>
              <MenuItem value={60}>60%</MenuItem>
              <MenuItem value={70}>70%</MenuItem>
              <MenuItem value={80}>80%</MenuItem>
              <MenuItem value={90}>90%</MenuItem>
              <MenuItem value={100}>100%</MenuItem>
            </TextField>
          )}
        />
      </Stack>
    </Box>
  );
}
