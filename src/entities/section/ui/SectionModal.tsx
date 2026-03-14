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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateSectionRequest,
  SectionDto,
  useGetSectionByIdQuery,
} from "@/entities/section/model/sectionsApi";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";

interface SectionModalFormProps {
  open: boolean;
  onSubmit: (sectionInfo: CreateSectionRequest) => void;
  onDelete: (sectionId: number) => void;
  onClose: () => void;
  isCreation: boolean;
  currentValues?: SectionDto;
}

export default function SectionModalForm({
  open,
  onSubmit,
  onDelete,
  onClose,
  isCreation,
  currentValues,
}: SectionModalFormProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CreateSectionRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          description: "",
          priority: 0,
        }
      : {
          title: currentValues?.title || "",
          description: currentValues?.description || "",
          priority: currentValues?.priority || 0,
        },
  });

  useEffect(() => {
    // Обновляем значения формы только в режиме редактирования
    if (!isCreation && currentValues) {
      reset({
        title: currentValues.title || "",
        description: currentValues.description || "",
        priority: currentValues.priority || 0,
      });
    }
    // Сбрасываем ошибки при открытии модального окна
    setError(null);
  }, [currentValues, isCreation, reset, open]);

  // Обработчик отправки формы
  const handleSubmitForm = async (data: CreateSectionRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      // Валидация
      if (!data.title.trim()) {
        setError("Название секции обязательно");
        return;
      }

      if (data.priority < 0) {
        setError("Приоритет не может быть отрицательным");
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
      setError("Ошибка при сохранении секции");
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
          {isCreation ? "Добавление раздела" : "Редактирование раздела"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isCreation
            ? "Укажите название и краткое описание создаваемого раздела"
            : "Укажите новое название или краткое описание раздела"}
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
        >
          <Stack spacing={2}>
            <TextField
              {...register("title", {
                required: "Название обязательно",
              })}
              label="Название"
              variant="outlined"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              placeholder="Введите название раздела"
            />

            <TextField
              {...register("description")}
              label="Описание"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              placeholder="Краткое описание раздела"
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <Typography variant="body2">Приоритет</Typography>

            <TextField
              {...register("priority", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Приоритет не может быть отрицательным",
                },
              })}
              type="number"
              variant="outlined"
              fullWidth
              error={!!errors.priority}
              helperText={errors.priority?.message}
              disabled={isLoading}
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
                {isCreation ? "Отменить" : "Отменить"}
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
        objectType={"section"}
        objectname={getValues("title")}
      />
    </Dialog>
  );
}
