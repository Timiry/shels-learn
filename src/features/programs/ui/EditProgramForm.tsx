"use client";

import { Controller, useForm } from "react-hook-form";
import { Box, Typography, TextField, Stack, MenuItem } from "@mui/material";
import {
  ProgramDto,
  CreateLearningProgramRequest,
} from "@/features/programs/model/programsApi";

interface EditProgramFormProps {
  onSubmit: (programInfo: CreateLearningProgramRequest) => void;
  formId: string;
  isCreation: boolean;
  currentValues?: ProgramDto;
}

export default function EditProgramForm({
  onSubmit,
  formId,
  isCreation,
  currentValues,
}: EditProgramFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateLearningProgramRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          description: "",
          accessCondition: "PREVIOUS_COURSES_VIEWED_OR_PENDING",
          deadlineDays: undefined,
        }
      : {
          title: currentValues?.title || "",
          description: currentValues?.description || "",
          accessCondition:
            currentValues?.accessCondition ||
            "PREVIOUS_COURSES_VIEWED_OR_PENDING",
          deadlineDays: currentValues?.deadlineDays,
        },
  });

  const onSubmitForm = (programInfo: CreateLearningProgramRequest) => {
    if (!programInfo.title?.trim()) {
      return;
    }
    onSubmit(programInfo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} id={formId}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="body1" gutterBottom>
            Название программы
          </Typography>
          <TextField
            {...register("title", { required: "Название обязательно" })}
            placeholder="Название программы"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Описание
          </Typography>
          <TextField
            {...register("description")}
            placeholder="Описание программы"
            fullWidth
            multiline
            rows={4}
          />
        </Box>

        <Box>
          <Typography variant="body1">Параметры прохождения</Typography>
          <Typography variant="body2" gutterBottom>
            Условие доступа к следующему курсу программы
          </Typography>
          <Controller
            name="accessCondition"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                error={!!errors.accessCondition}
                helperText={errors.accessCondition?.message}
              >
                <MenuItem value="ALL_OPEN">Все курсы открыты сразу</MenuItem>
                <MenuItem value="PREVIOUS_COURSES_VIEWED_OR_PENDING">
                  Все уроки курса просмотрены или отправлены на проверку
                </MenuItem>
                <MenuItem value="PREVIOUS_COURSES_COMPLETED">
                  Все уроки курса завершены успешно
                </MenuItem>
              </TextField>
            )}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Дедлайн завершения программы
          </Typography>
          <TextField
            {...register("deadlineDays", {
              valueAsNumber: true,
              min: { value: 1, message: "Минимум 1 день" },
            })}
            placeholder="?"
            helperText={
              errors.deadlineDays?.message ||
              "Количество дней, за которые студент должен пройти программу"
            }
            error={!!errors.deadlineDays}
            type="number"
            sx={{ width: "250px" }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
