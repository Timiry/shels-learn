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
import { UpdateUserRequest as UpdateMyProfileRequest } from "@/features/student/api/studentApi";

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
          snils: "",
          email: "",
          role: "STUDENT",
          phone: "",
          comment: "",
          password: "",
        }
      : {
          fullName: currentValues?.fullName,
          snils: currentValues?.snils || "",
          email: currentValues?.email,
          role: currentValues?.role,
          phone: currentValues?.phone || "",
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
    if (
      !userInfo.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userInfo.email)
    ) {
      setError("email", { message: "Невалидная почта" });
      return;
    }
    if (!/^\d{3}-\d{3}-\d{3} \d{2}$/.test(userInfo.snils)) {
      setError("snils", { message: "Невалидный формат снилса" });
      return;
    }
    if (userInfo.phone?.length && !/^\+7\d{10}$/.test(userInfo.phone)) {
      setError("phone", { message: "Невалидный формат телефона" });
      return;
    }
    onSubmit(userInfo);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)} id={formId}>
      <Stack spacing={3}>
        <Typography variant="subtitle1" mb={"14px"}>
          Общая информация
        </Typography>

        <Box>
          <Typography variant="body1" gutterBottom>
            ФИО
          </Typography>
          <TextField
            {...register("fullName", { required: "ФИО обязательно" })}
            placeholder="ФИО"
            fullWidth
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        </Box>

        <Box>
          <Typography variant="body1">СНИЛС</Typography>
          <Typography variant="caption" gutterBottom>
            В формате XXX-XXX-XXX XX
          </Typography>
          <TextField
            {...register("snils", { required: "СНИЛС обязателен" })}
            placeholder="123-456-789 00"
            fullWidth
            error={!!errors.snils}
            helperText={errors.snils?.message}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Электронная почта
          </Typography>
          <TextField
            {...register("email")}
            placeholder="Электронная почта"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>

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

        <Box>
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
        </Box>

        <Typography variant="subtitle1" mb={"14px"}>
          Дополнительная информация
        </Typography>

        <Box>
          <Typography variant="body1">Телефон</Typography>
          <Typography variant="caption" gutterBottom>
            В формате +7XXXXXXXXXX
          </Typography>
          <TextField
            {...register("phone")}
            placeholder="+79781234567"
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Комментарий
          </Typography>
          <TextField
            {...register("comment")}
            placeholder="Комментарий"
            fullWidth
            multiline
            rows={6}
          />
        </Box>
      </Stack>
    </Box>
  );
}
