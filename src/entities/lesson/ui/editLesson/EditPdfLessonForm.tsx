import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/coursesApi";
import { useUploadMutation } from "@/shared/api/filesApi";
import {
  Stack,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import FileIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  currentValues?: LessonDto;
  isCreation: boolean;
}

export default function EditPdfLessonForm({
  onSubmit,
  onCancel,
  currentValues,
  isCreation,
}: EditLessonFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState<string | null>(
    currentValues?.theoryContent || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [uploadFile] = useUploadMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTheoryLessonRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          fullPoints: 1,
          content: "",
          lessonType: "THEORY_PDF",
        }
      : {
          title: currentValues?.title || "",
          fullPoints: currentValues?.fullPoints || 1,
          content: currentValues?.theoryContent || "",
          lessonType: currentValues?.lessonType || "THEORY_PDF",
        },
  });

  const title = watch("title");
  const fullPoints = watch("fullPoints");

  // Обработчик выбора файла (только сохраняем в состояние, не загружаем)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация типа файла
    if (file.type !== "application/pdf") {
      setSubmitError("Пожалуйста, выберите файл в формате PDF");
      return;
    }

    // Валидация размера файла (максимум 20 МБ)
    if (file.size > 20 * 1024 * 1024) {
      setSubmitError("Размер файла не должен превышать 20 МБ");
      return;
    }

    setSubmitError(null);
    setSelectedFile(file);
    // Сбрасываем поле ввода для возможности повторной загрузки того же файла
    event.target.value = "";
  };

  // Обработчик удаления существующего файла (только при редактировании)
  const handleRemoveExistingFile = () => {
    setExistingPdfUrl(null);
    setSelectedFile(null);
    setValue("content", "");
  };

  // Обработчик сабмита формы
  const onSubmitForm = async (lessonInfo: CreateTheoryLessonRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Проверка обязательных полей
      if (!lessonInfo.title.trim()) {
        setSubmitError("Название урока обязательно");
        return;
      }

      if (lessonInfo?.fullPoints <= 0) {
        setSubmitError("Баллы за прохождение должны быть больше 0");
        return;
      }

      let fileUrl = existingPdfUrl || "";

      // Если выбран новый файл - загружаем его
      if (selectedFile) {
        const uploadResult = await uploadFile({ file: selectedFile }).unwrap();

        if (!uploadResult.link) {
          throw new Error("Не получен путь к файлу");
        }

        fileUrl = uploadResult.link;
      }

      if (!fileUrl) {
        setSubmitError("Пожалуйста, загрузите PDF файл");
        return;
      }

      // Отправляем данные формы с ссылкой на файл
      onSubmit({
        ...lessonInfo,
        content: fileUrl,
      });
      setIsSubmitting(false);
    } catch (err) {
      console.error("Ошибка при сохранении урока:", err);
      setSubmitError(
        (err as any)?.data?.message ||
          "Ошибка при сохранении урока. Попробуйте еще раз."
      );
    }
  };

  // Определяем текущее состояние файла
  const hasExistingFile = !!existingPdfUrl && !selectedFile;
  const hasNewFile = !!selectedFile;
  const isFileRequired = isCreation && !hasExistingFile && !hasNewFile;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={3}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box>
          <Typography variant="body1" gutterBottom>
            Название урока
          </Typography>
          <TextField
            {...register("title", {
              required: "Название обязательно",
              minLength: { value: 2, message: "Минимум 2 символа" },
            })}
            placeholder="Название урока"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Баллы за прохождение
          </Typography>
          <TextField
            {...register("fullPoints", {
              valueAsNumber: true,
              required: "Баллы обязательны",
              min: { value: 1, message: "Минимум 1 балл" },
              max: { value: 100, message: "Максимум 100 баллов" },
            })}
            type="number"
            placeholder="Баллы за прохождение"
            fullWidth
            error={!!errors.fullPoints}
            helperText={
              errors.fullPoints?.message ||
              "Укажите количество баллов, которое получит студент за прохождение урока"
            }
            inputProps={{ min: 1, max: 100 }}
            disabled={isSubmitting}
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            PDF файл урока
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "background.default",
              borderStyle: "dashed",
              borderColor:
                hasExistingFile || hasNewFile ? "success.main" : "divider",
              borderWidth: 2,
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor:
                  hasExistingFile || hasNewFile
                    ? "success.dark"
                    : "primary.main",
                bgcolor:
                  hasExistingFile || hasNewFile
                    ? "success.light"
                    : "action.hover",
              },
            }}
            onClick={() =>
              !isSubmitting && document.getElementById("pdf-upload")?.click()
            }
          >
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={isSubmitting}
            />

            {isSubmitting ? (
              // Состояние загрузки при сабмите
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CircularProgress size={48} color="primary" />
                <Typography variant="body1" color="text.secondary">
                  Загрузка файла и сохранение урока...
                </Typography>
              </Box>
            ) : hasExistingFile ? (
              // Состояние: файл уже загружен ранее (при редактировании)
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FileIcon sx={{ fontSize: 64, color: "primary.main" }} />
                <Box sx={{ maxWidth: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.primary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {existingPdfUrl.split("/").pop() || "PDF файл"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Файл уже загружен на сервер
                  </Typography>
                </Box>
                {!isCreation && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveExistingFile();
                    }}
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ) : hasNewFile ? (
              // Состояние: выбран новый файл для загрузки
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FileIcon sx={{ fontSize: 64, color: "primary.main" }} />
                <Box sx={{ maxWidth: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.primary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {`${(selectedFile.size / 1024 / 1024).toFixed(2)} МБ`} •
                    Файл будет загружен при сохранении
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  sx={{ mt: 1 }}
                >
                  Отменить выбор
                </Button>
              </Box>
            ) : (
              // Состояние ожидания загрузки
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <DownloadIcon sx={{ fontSize: 64, color: "primary.main" }} />
                <Typography variant="h6" fontWeight={600}>
                  Загрузить PDF файл
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Перетащите файл сюда или нажмите для выбора
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    px: 2,
                    py: 0.5,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: 1,
                    fontSize: "0.875rem",
                  }}
                >
                  Поддерживаемый формат: PDF до 20 МБ
                </Box>
              </Box>
            )}
          </Paper>

          {isFileRequired && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              PDF файл обязателен для создания урока
            </Typography>
          )}
        </Box>

        {/* Кнопки действий */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            py: 3,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button type="submit" variant="contained">
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
