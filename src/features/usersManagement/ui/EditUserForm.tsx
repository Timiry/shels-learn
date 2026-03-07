"use client";

import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { UpdateUserRequest, UserDto } from "@/entities/user/model/usersApi";
import { UpdateMyProfileRequest } from "@/features/student/api/studentApi";

interface EditUserFormProps {
  onSubmit: (userInfo: UpdateUserRequest | UpdateMyProfileRequest) => void;
  formId: string;
  isCreation: boolean;
  isAdmin: boolean;
  currentValues?: UserDto;
}

export default function EditUserForm({
  onSubmit,
  formId,
  isCreation,
  isAdmin,
  currentValues,
}: EditUserFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserRequest>({
    defaultValues: isCreation
      ? {
          fullName: "",
          email: "",
          role: "STUDENT",
          phone: "",
          comment: "",
          password: "",
        }
      : {
          fullName: currentValues?.fullName,
          email: currentValues?.email,
          role: currentValues?.role,
          phone: currentValues?.phone,
          comment: currentValues?.comment,
          password: "",
        },
  });

  // Следим за значением роли для переключателя
  const role = watch("role");

  // Обработчик переключения прав администратора
  const handleAdminToggle = (checked: boolean) => {
    setValue("role", checked ? "ADMIN" : "STUDENT");
  };

  const onSubmitForm = (userInfo: UpdateUserRequest) => {
    if (userInfo.fullName === "") {
      setError("fullName", { message: "ФИО должно быть заполнено" });
      return;
    }
    if (
      !userInfo.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userInfo.email)
    ) {
      setError("email", { message: "Невалидная почта" });
      return;
    }
    onSubmit(userInfo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} id={formId}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" mb={"14px"}>
          Общая информация
        </Typography>

        <Typography variant="body1">ФИО</Typography>
        <TextField
          {...register("fullName")}
          placeholder="ФИО"
          fullWidth
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />

        <Typography variant="body1">Электронная почта</Typography>
        <TextField
          {...register("email")}
          placeholder="Электронная почта"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Typography variant="subtitle1" mb={"14px"}>
          Настройки доступа
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={role === "ADMIN"}
              onChange={(e) => handleAdminToggle(e.target.checked)}
              color="primary"
              disabled={!isAdmin}
            />
          }
          label={
            <Box>
              <Typography variant="body1">Права администратора</Typography>
              <Typography variant="caption" color="text.secondary">
                {role === "ADMIN"
                  ? "Пользователь имеет полный доступ к управлению системой"
                  : "Пользователь имеет доступ только к обучению"}
              </Typography>
            </Box>
          }
          sx={{
            alignItems: "flex-start",
            ml: 0,
            mt: 1,
          }}
        />

        <Typography variant="subtitle1" mb={"14px"}>
          Пароль
        </Typography>
        <TextField
          {...register("password")}
          placeholder="Пароль"
          fullWidth
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Typography variant="subtitle1" mb={"14px"}>
          Дополнительная информация
        </Typography>

        <Typography variant="body1">Телефон</Typography>
        <TextField {...register("phone")} placeholder="Телефон" fullWidth />

        <Typography variant="body1">Комментарий</Typography>
        <TextField
          {...register("comment")}
          placeholder="Комментарий"
          fullWidth
          multiline
          rows={6}
        />
      </Stack>
    </Box>
  );
}
