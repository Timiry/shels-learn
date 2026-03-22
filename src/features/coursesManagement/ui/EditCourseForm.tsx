"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Stack,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  CourseDto,
  CreateCourseRequest,
} from "@/entities/course/model/coursesApi";
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          description: "",
          authorFullName: "",
          sectionId: sectionIdForCreation || 1,
          deadlineDays: undefined,
          lessonsFreeOrder: false,
        }
      : {
          title: currentValues?.title,
          description: currentValues?.description,
          authorFullName: currentValues?.authorFullName,
          sectionId: currentValues?.sectionId,
          deadlineDays: currentValues?.deadlineDays,
          lessonsFreeOrder: currentValues?.lessonsFreeOrder,
        },
  });

  const lessonsFreeOrder = watch("lessonsFreeOrder");

  const onSubmitForm = (courseInfo: CreateCourseRequest) => {
    if (courseInfo.title === "") {
      setError("title", { message: "Название должно быть заполнено" });
      return;
    }
    if (courseInfo.deadlineDays !== undefined && courseInfo.deadlineDays < 1) {
      setError("deadlineDays", {
        message: "Срок прохождения должен быть не менее 1 дня",
      });
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

        <Typography variant="body1">Дедлайн</Typography>
        <TextField
          {...register("deadlineDays")}
          placeholder="?"
          helperText={
            errors.deadlineDays?.message ||
            "Количество дней, за которые студент должен пройти курс"
          }
          error={!!errors.deadlineDays}
          type="number"
          sx={{ width: "250px" }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={lessonsFreeOrder}
              onChange={(e) => setValue("lessonsFreeOrder", e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="body1">
                Свободный режим выполнения
              </Typography>
              <Typography variant="body2">
                Студенты могут проходить уроки курса в любом порядке
              </Typography>
            </Box>
          }
          sx={{
            alignItems: "flex-start",
            ml: 0,
            mt: 1,
          }}
        />
      </Stack>
    </Box>
  );
}
