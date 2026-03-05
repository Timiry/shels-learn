import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/types";
import { useUploadMutation } from "@/shared/api/filesApi";
import {
  Stack,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import FileIcon from "@mui/icons-material/DescriptionOutlined";
import DownloadIcon from "@mui/icons-material/FileDownloadOutlined";
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(
    currentValues?.theoryContent || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [uploadFile] = useUploadMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateTheoryLessonRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          fullPoints: 1,
          content: "",
          contentType: "PDF_FILE",
        }
      : {
          title: currentValues?.title || "",
          fullPoints: currentValues?.fullPoints || 1,
          content: currentValues?.theoryContent || "",
          contentType: currentValues?.theoryContentType || "PDF_FILE",
        },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация типа файла
    if (file.type !== "application/pdf") {
      setUploadError("Пожалуйста, выберите файл в формате PDF");
      return;
    }

    // Валидация размера файла (максимум 20 МБ)
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Размер файла не должен превышать 20 МБ");
      return;
    }

    setUploadError(null);
    setPdfFile(file);
    setIsUploading(true);

    try {
      // Загружаем файл на сервер
      const result = await uploadFile({ file }).unwrap();

      if (result.link) {
        setPdfUrl(result.link);
        setValue("content", result.link);
        setUploadError(null);
      } else {
        throw new Error("Не получен путь к файлу");
      }
    } catch (err) {
      console.error("Ошибка загрузки PDF:", err);
      setUploadError(
        (err as any)?.data?.message ||
          "Ошибка загрузки файла. Попробуйте еще раз."
      );
    } finally {
      setIsUploading(false);
      // Сбрасываем поле ввода для возможности повторной загрузки того же файла
      event.target.value = "";
    }
  };

  const onSubmitForm = (lessonInfo: CreateTheoryLessonRequest) => {
    if (!lessonInfo.title.trim()) {
      setValue("title", lessonInfo.title.trim(), { shouldValidate: true });
      return;
    }
    if (!pdfUrl) {
      setUploadError("Пожалуйста, загрузите PDF файл");
      return;
    }

    onSubmit({
      ...lessonInfo,
      content: pdfUrl,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={3}>
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {uploadError}
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
          />
        </Box>

        <Box>
          <Typography variant="body1" gutterBottom>
            Содержание урока
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "background.default",
              borderStyle: "dashed",
              borderColor: pdfUrl ? "success.main" : "divider",
              borderWidth: 2,
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: pdfUrl ? "success.dark" : "primary.main",
                bgcolor: pdfUrl ? "success.light" : "action.hover",
              },
            }}
            onClick={() =>
              !isUploading && document.getElementById("pdf-upload")?.click()
            }
          >
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={isUploading}
            />

            {isUploading ? (
              // Состояние загрузки
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
                  Загрузка файла...
                </Typography>
              </Box>
            ) : pdfUrl ? (
              // Предпросмотр загруженного файла
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <FileIcon sx={{ fontSize: 64, color: "error.main" }} />
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
                    {pdfFile?.name || pdfUrl.split("/").pop() || "PDF файл"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {pdfFile?.size
                      ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} МБ`
                      : "Файл загружен на сервер"}
                  </Typography>
                </Box>
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
                <DownloadIcon sx={{ fontSize: 64 }} />
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
          {errors.content && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              {errors.content.message}
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
          }}
        >
          <Button type="submit" variant="contained">
            {isCreation ? "Создать" : "Сохранить изменения"}
          </Button>
          <Button type="button" variant="outlined" onClick={onCancel}>
            Отмена
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
