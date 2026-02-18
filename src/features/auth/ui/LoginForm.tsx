"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLoginMutation } from "../api/authApi";
import { loginSchema } from "../lib/validation/loginSchema";
import FormLayout from "@/shared/ui/FormLayout";

// Типы для формы
type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [login] = useLoginMutation();

  const onSubmitForm = async (data: LoginFormValues) => {
    onSubmit(data.email, data.password);
  };

  return (
    <FormLayout component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={2}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Image src="/logo.png" alt="Shels logo" width={115} height={85} />
          <Typography variant="h6" component="h1" marginY={3}>
            Для входа укажите логин и пароль
          </Typography>
        </Box>

        <TextField
          {...register("email")}
          label="Электронная почта"
          type="email"
          fullWidth
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          {...register("password")}
          label="Пароль"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="current-password"
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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Войти"}
        </Button>

        <Link
          component={NextLink}
          href="/forgot-password"
          variant="body2"
          color="primary"
          align="center"
          mt={1}
        >
          Восстановить пароль
        </Link>
      </Stack>
    </FormLayout>
  );
}
