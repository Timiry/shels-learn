"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material/";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { setPasswordSchema } from "../lib/validation/setPasswordSchema";
import z from "zod";
import Image from "next/image";
import FormLayout from "@/shared/ui/FormLayout";

type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

interface SetPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
}

export function SetPasswordForm({
  onSubmit,
  isLoading = false,
}: SetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitForm = async (data: SetPasswordFormData) => {
    onSubmit(data.password);
  };

  return (
    <FormLayout component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={2}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Image src="/logo.png" alt="Shels logo" width={115} height={85} />
          <Typography variant="h6" my={4}>
            Для доступа к учетной записи установите пароль
          </Typography>
        </Box>

        <TextField
          {...register("password")}
          label="Пароль"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="new-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />

        <TextField
          {...register("confirmPassword")}
          label="Повторите пароль"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          autoComplete="new-password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Установить пароль"
          )}
        </Button>
      </Stack>
    </FormLayout>
  );
}
