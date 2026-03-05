"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Link,
} from "@mui/material/";
import NextLink from "next/link";
import { forgotPasswordSchema } from "../lib/validation/forgotPasswordSchema";
import z from "zod";
import Image from "next/image";
import FormLayout from "@/shared/ui/FormLayout";
import { routes } from "@/shared/config/routes";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading = false,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmitForm = async (data: ForgotPasswordFormData) => {
    onSubmit(data.email);
  };

  return (
    <FormLayout component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={2}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Image src="/logo.png" alt="Shels logo" width={115} height={85} />
          <Typography variant="h2" component="h1" mt={3} mb={1}>
            Восстановление доступа
          </Typography>
          <Typography variant="body2" mb={4}>
            Введите адрес электронной почты, указанной при регистрации в системе
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
            "Восстановить"
          )}
        </Button>
        <Link
          component={NextLink}
          href={routes.auth.login}
          variant="body2"
          color="primary"
          align="center"
          mt={1}
        >
          Вернуться на страницу авторизации
        </Link>
      </Stack>
    </FormLayout>
  );
}
