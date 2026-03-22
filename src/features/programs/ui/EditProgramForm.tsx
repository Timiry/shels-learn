// features/program-management/ui/EditProgramForm.tsx
"use client";

import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Stack,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
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
          deadlineAt: undefined,
          blockAfterDeadline: false,
        }
      : {
          title: currentValues?.title || "",
          description: currentValues?.description || "",
          accessCondition:
            currentValues?.accessCondition ||
            "PREVIOUS_COURSES_VIEWED_OR_PENDING",
          deadlineAt: currentValues?.deadlineAt,
          blockAfterDeadline: currentValues?.blockAfterDeadline || false,
        },
  });

  const onSubmitForm = (programInfo: CreateLearningProgramRequest) => {
    if (!programInfo.title?.trim()) {
      return;
    }
    // if (
    //   programInfo.deadlineAt !== undefined &&
    //   programInfo.deadlineAt !== null &&
    //   programInfo.deadlineAt < 1
    // ) {
    //   setError("deadlineAt", {
    //     message: "Срок прохождения должен быть не менее 1 дня",
    //   });
    //   return;
    // }
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
            {...register("deadlineAt", {
              valueAsNumber: true,
              min: { value: 1, message: "Минимум 1 день" },
            })}
            placeholder="?"
            helperText={
              errors.deadlineAt?.message ||
              "Количество дней, за которые студент должен пройти программу"
            }
            error={!!errors.deadlineAt}
            type="number"
            sx={{ width: "250px" }}
          />
        </Box>

        <Box>
          <Controller
            name="blockAfterDeadline"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography>Блокировать доступ после дедлайна</Typography>
                    <Typography variant="body2">
                      Если включено, студенты не смогут продолжать прохождение
                      программы после установленного дедлайна
                    </Typography>
                  </Box>
                }
              />
            )}
          />
        </Box>
      </Stack>
    </Box>
  );
}
