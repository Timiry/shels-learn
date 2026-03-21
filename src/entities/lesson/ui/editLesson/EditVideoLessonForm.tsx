"use client";

import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/coursesApi";

import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Stack, Button } from "@mui/material";
import { isYouTubeUrl } from "../../lib/utils/validationYoutubeUrl";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  isCreation: boolean;
  currentValues?: LessonDto;
}

export default function EditVideoLessonForm({
  onSubmit,
  onCancel,
  isCreation,
  currentValues,
}: EditLessonFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateTheoryLessonRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          fullPoints: 1,
          content: "",
          lessonType: "THEORY_VIDEO",
        }
      : {
          title: currentValues?.title || "",
          fullPoints: currentValues?.fullPoints || 1,
          content: currentValues?.theoryContent || "",
          lessonType: currentValues?.lessonType || "THEORY_VIDEO",
        },
  });

  const onSubmitForm = (lessonInfo: CreateTheoryLessonRequest) => {
    if (!isYouTubeUrl(lessonInfo.content)) {
      setError("content", { message: "Невалидная YouTube ссылка" });
      return;
    }

    onSubmit(lessonInfo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="body1" gutterBottom>
            Название урока
          </Typography>
          <TextField
            {...register("title", {
              required: "Название обязательно",
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            placeholder="Название урока"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Баллы за прохождение
          </Typography>
          <TextField
            {...register("fullPoints", {
              valueAsNumber: true,
              required: "Баллы обязательны",
              min: { value: 1, message: "Минимум 1 балл" },
              max: { value: 100, message: "Максимум 100 баллов" },
            })}
            type="number"
            placeholder="Баллы за прохождение"
            fullWidth
            error={!!errors.fullPoints}
            helperText={
              errors.fullPoints?.message ||
              "Укажите количество баллов, которое получит студент за прохождение урока"
            }
            inputProps={{ min: 1, max: 100 }}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Содержание урока
          </Typography>
          <TextField
            {...register("content", {
              required: "Содержание обязательно",
            })}
            placeholder="Ссылка на видео, опубликованное на YouTube"
            fullWidth
            error={!!errors.content}
            helperText={
              errors.content?.message || "Укажите ссылку на видеохостинге"
            }
          />
        </Box>

        {/* Кнопки действий */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            py: 3,
          }}
        >
          <Button type="submit" variant="contained">
            {isCreation ? "Создать" : "Сохранить изменения"}
          </Button>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Отмена
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
