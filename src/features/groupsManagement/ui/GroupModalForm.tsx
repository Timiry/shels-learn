import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import {
  CreateGroupRequest,
  GroupDto,
} from "@/features/groupsManagement/api/groupsApi";
import groupTypeToWord from "../lib/groupTypeToWord";

interface GroupModalFormProps {
  open: boolean;
  onSubmit: (groupInfo: CreateGroupRequest) => void;
  onDelete: (groupId: string) => void;
  onClose: () => void;
  isCreation: boolean;
  currentValues: GroupDto;
}

export default function GroupModalForm({
  open,
  onSubmit,
  onDelete,
  onClose,
  isCreation,
  currentValues,
}: GroupModalFormProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<CreateGroupRequest>({
    defaultValues: {
      title: currentValues?.title || "",
      type: currentValues?.type,
    },
  });

  // Обработчик отправки формы
  const handleSubmitForm = async (data: CreateGroupRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      // Валидация
      if (!data.title.trim()) {
        setError("Название группы обязательно");
        return;
      }

      // Отправка данных
      onSubmit({
        ...data,
        title: data.title.trim(),
      });

      // Очистка ошибок
      setError(null);
    } catch (err) {
      setError("Ошибка при сохранении группы");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogContent
        sx={{
          py: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {isCreation ? "Добавление группы" : "Редактирование группы"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component={"form"}
          onSubmit={handleSubmit(handleSubmitForm)}
          width="100%"
          pt={4}
        >
          <Stack spacing={2}>
            <Typography variant="body1">Название</Typography>
            <TextField
              {...register("title", {
                required: "Название обязательно",
              })}
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="Введите название группы"
            />

            <Typography variant="body1">Тип группы</Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Object.entries(groupTypeToWord).map((item) => (
                    <MenuItem key={item[0]} value={item[0]}>
                      {item[1]}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={onClose}
                disabled={isLoading}
              >
                Отменить
              </Button>

              <Stack direction="row" spacing={1}>
                {!isCreation && (
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                    }}
                    disabled={isLoading}
                  >
                    Удалить
                  </Button>
                )}
                <Button type="submit" variant="contained" disabled={isLoading}>
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : isCreation ? (
                    "Добавить"
                  ) : (
                    "Сохранить"
                  )}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </DialogContent>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (currentValues) onDelete(currentValues.id);
          setIsDeleteModalOpen(false);
          onClose();
        }}
        objectType={"group"}
        objectname={getValues("title")}
      />
    </Dialog>
  );
}
