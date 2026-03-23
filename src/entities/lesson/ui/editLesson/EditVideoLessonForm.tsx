"use client";

import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/coursesApi";
import { useUploadMutation } from "@/shared/api/filesApi";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { isYouTubeUrl } from "../../lib/utils/validationYoutubeUrl";
import FileUploadIcon from "@mui/icons-material/CloudUploadOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  isCreation: boolean;
  currentValues?: LessonDto;
}

export default function EditVideoLessonForm({
  onSubmit,
  onCancel,
  isCreation,
  currentValues,
}: EditLessonFormProps) {
  const [videoSource, setVideoSource] = useState<"youtube" | "upload">(
    "youtube"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(
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
          lessonType: "THEORY_VIDEO",
        }
      : {
          title: currentValues?.title || "",
          fullPoints: currentValues?.fullPoints || 1,
          content: currentValues?.theoryContent || "",
          lessonType: currentValues?.lessonType || "THEORY_VIDEO",
        },
  });

  const title = watch("title");
  const fullPoints = watch("fullPoints");
  const content = watch("content");

  // Определение типа существующего видео при редактировании
  useEffect(() => {
    if (!isCreation && currentValues?.theoryContent) {
      if (isYouTubeUrl(currentValues.theoryContent)) {
        setVideoSource("youtube");
        setValue("content", currentValues.theoryContent);
      } else {
        setVideoSource("upload");
        setExistingVideoUrl(currentValues.theoryContent);
      }
    }
  }, [isCreation, currentValues, setValue]);

  // Обработчик выбора файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация типа файла
    if (!file.type.startsWith("video/")) {
      setSubmitError("Пожалуйста, выберите видео файл (MP4, WebM, MOV и др.)");
      return;
    }

    // Валидация размера файла (максимум 100 МБ)
    if (file.size > 100 * 1024 * 1024) {
      setSubmitError("Размер видео не должен превышать 100 МБ");
      return;
    }

    setSubmitError(null);
    setSelectedFile(file);
    setExistingVideoUrl(null);
    // Сбрасываем поле ввода для возможности повторной загрузки того же файла
    event.target.value = "";
  };

  // Обработчик удаления существующего файла
  const handleRemoveExistingFile = () => {
    setExistingVideoUrl(null);
    setSelectedFile(null);
    setValue("content", "");
  };

  // Обработчик изменения режима
  const handleVideoSourceChange = (value: "youtube" | "upload") => {
    setVideoSource(value);
    setValue("content", "");
    setSelectedFile(null);
    setExistingVideoUrl(null);
    setSubmitError(null);
  };

  // Обработчик сабмита формы
  const onSubmitForm = async (lessonInfo: CreateTheoryLessonRequest) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Проверка обязательных полей
      if (!lessonInfo.title.trim()) {
        setSubmitError("Название урока обязательно");
        setIsSubmitting(false);
        return;
      }

      if (lessonInfo.fullPoints <= 0) {
        setSubmitError("Баллы за прохождение должны быть больше 0");
        setIsSubmitting(false);
        return;
      }

      let videoUrl = "";

      // Обработка режима YouTube
      if (videoSource === "youtube") {
        if (!isYouTubeUrl(lessonInfo.content)) {
          setSubmitError("Невалидная ссылка на YouTube видео");
          setIsSubmitting(false);
          return;
        }
        videoUrl = lessonInfo.content;
      }
      // Обработка режима загрузки файла
      else {
        if (existingVideoUrl) {
          videoUrl = existingVideoUrl;
        } else if (selectedFile) {
          const uploadResult = await uploadFile({
            file: selectedFile,
          }).unwrap();

          if (!uploadResult.link) {
            throw new Error("Не получен путь к загруженному видео");
          }

          videoUrl = uploadResult.link;
        } else {
          setSubmitError("Пожалуйста, загрузите видео файл");
          setIsSubmitting(false);
          return;
        }
      }

      // Отправляем данные формы с ссылкой на видео
      onSubmit({
        ...lessonInfo,
        content: videoUrl,
      });
    } catch (err) {
      console.error("Ошибка при сохранении видео урока:", err);
      setSubmitError(
        (err as any)?.data?.message ||
          "Ошибка при сохранении урока. Попробуйте еще раз."
      );
      setIsSubmitting(false);
    }
  };

  // Определяем текущее состояние видео
  const hasExistingVideo = !!existingVideoUrl && !selectedFile;
  const hasNewFile = !!selectedFile;
  const isVideoRequired =
    isCreation && !hasExistingVideo && !hasNewFile && videoSource === "upload";
  const isYoutubeRequired =
    isCreation && !content.trim() && videoSource === "youtube";

  // Получение превью для YouTube видео
  const getYouTubePreviewUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  };

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
          <Typography variant="body1" gutterBottom sx={{ mb: 1 }}>
            Источник видео
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={videoSource}
              onChange={(e) =>
                handleVideoSourceChange(e.target.value as "youtube" | "upload")
              }
            >
              <FormControlLabel
                value="youtube"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <YouTubeIcon color="error" />
                    <Typography>YouTube</Typography>
                  </Box>
                }
                disabled={isSubmitting}
              />
              <FormControlLabel
                value="upload"
                control={<Radio />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FileUploadIcon color="primary" />
                    <Typography>Загрузить видео</Typography>
                  </Box>
                }
                disabled={isSubmitting}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {videoSource === "youtube" ? (
          // Режим YouTube
          <Box>
            <Typography variant="body1" gutterBottom>
              Ссылка на YouTube видео
            </Typography>
            <TextField
              {...register("content", {
                required: "Ссылка на видео обязательна",
                validate: (value) =>
                  isYouTubeUrl(value) || "Невалидная ссылка на YouTube видео",
              })}
              placeholder="https://www.youtube.com/watch?v=..."
              fullWidth
              error={!!errors.content || (isYoutubeRequired && !content.trim())}
              helperText={
                errors.content?.message ||
                (isYoutubeRequired && !content.trim()
                  ? "Ссылка на YouTube видео обязательна"
                  : "Укажите полную ссылку на видео на YouTube")
              }
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <YouTubeIcon sx={{ color: "error.main", mr: 1 }} />
                ),
              }}
            />
            {content && isYouTubeUrl(content) && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={
                    getYouTubePreviewUrl(content) || "/placeholder-video.jpg"
                  }
                  alt="Превью видео YouTube"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 200,
                    borderRadius: 8,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Превью видео из YouTube
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          // Режим загрузки файла
          <Box>
            <Typography variant="body1" gutterBottom>
              Видео файл урока
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "background.default",
                borderStyle: "dashed",
                borderColor:
                  hasExistingVideo || hasNewFile ? "success.main" : "divider",
                borderWidth: 2,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor:
                    hasExistingVideo || hasNewFile
                      ? "success.dark"
                      : "primary.main",
                  bgcolor:
                    hasExistingVideo || hasNewFile
                      ? "success.light"
                      : "action.hover",
                },
              }}
              onClick={() =>
                !isSubmitting &&
                document.getElementById("video-upload")?.click()
              }
            >
              <input
                type="file"
                id="video-upload"
                accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
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
                    Загрузка видео и сохранение урока...
                  </Typography>
                </Box>
              ) : hasExistingVideo ? (
                // Состояние: видео уже загружено ранее (при редактировании)
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <PlayCircleOutlineIcon
                    sx={{ fontSize: 64, color: "primary.main" }}
                  />
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
                      {existingVideoUrl.split("/").pop() || "Видео файл"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Видео уже загружено на сервер
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
                  <PlayCircleOutlineIcon
                    sx={{ fontSize: 64, color: "primary.main" }}
                  />
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
                  <FileUploadIcon
                    sx={{ fontSize: 64, color: "primary.main" }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    Загрузить видео файл
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
                    Поддерживаемые форматы: MP4, WebM, MOV до 100 МБ
                  </Box>
                </Box>
              )}
            </Paper>

            {isVideoRequired && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 1, display: "block" }}
              >
                Видео файл обязателен для создания урока
              </Typography>
            )}
          </Box>
        )}

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
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : isCreation ? (
              "Создать урок"
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
