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
import { activateAccountSchema } from "../lib/validation/activateAccountSchema";
import z from "zod";
import Image from "next/image";
import FormLayout from "@/shared/ui/FormLayout";

type ActivateAccountFormData = z.infer<typeof activateAccountSchema>;

interface ActivateAccountFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
}

export function ActivateAccountForm({
  onSubmit,
  isLoading = false,
}: ActivateAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivateAccountFormData>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmitForm = async (data: ActivateAccountFormData) => {
    onSubmit(data.password);
  };

  return (
    <FormLayout component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={2}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Image src="/logo.png" alt="Shels logo" width={115} height={85} />
          <Typography variant="h3" component="h1" mt={3} mb={1}>
            Добро пожаловать!
          </Typography>
          <Typography variant="body1" mb={4}>
            Для активации учетной записи укажите пароль
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
            "Активировать"
          )}
        </Button>
      </Stack>
    </FormLayout>
  );
}
