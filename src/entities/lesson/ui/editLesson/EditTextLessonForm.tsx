"use client";

import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/types";

import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Stack, Button } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Динамический импорт JoditEditor (отключаем SSR)
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  isCreation: boolean;
  currentValues?: LessonDto;
}

export default function EditTextLessonForm({
  onSubmit,
  onCancel,
  isCreation,
  currentValues,
}: EditLessonFormProps) {
  const [editorContent, setEditorContent] = useState(
    currentValues?.theoryContent || ""
  );
  const editor = useRef(null);

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
          contentType: "HTML_TEXT",
        }
      : {
          title: currentValues?.title || "",
          fullPoints: currentValues?.fullPoints || 1,
          content: currentValues?.theoryContent || "",
          contentType: currentValues?.theoryContentType || "HTML_TEXT",
        },
  });

  // Конфигурация Jodit (обязательно через useMemo для предотвращения потери фокуса)
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Введите содержание урока...",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "eraser",
        "brush",
        "|",
        "ul",
        "ol",
        "|",
        "paragraph",
        "superscript",
        "subscript",
        "|",
        "link",
        "table",
        "symbols",
        "|",
        "indent",
        "outdent",
        "align",
        "undo",
        "redo",
        "preview",
      ],
      minHeight: 400,
      language: "ru",
      toolbarAdaptive: false,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      defaultFontName: "Montserrat sans-serif",
      defaultFontSize: "14px",
      style: {
        font: "14px Montserrat",
        fontWeight: "400",
        overflowX: "auto",
        wordWrap: "break-word",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        whiteSpace: "normal",
      },
    }),
    []
  );

  const onSubmitForm = (lessonInfo: CreateTheoryLessonRequest) => {
    if (!lessonInfo.title.trim()) {
      setValue("title", lessonInfo.title.trim(), { shouldValidate: true });
      return;
    }
    setValue("content", editorContent);

    onSubmit({ ...lessonInfo, content: editorContent });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={3}>
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
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              p: 1,
              bgcolor: "background.paper",
            }}
          >
            <JoditEditor
              ref={editor}
              value={editorContent}
              config={config}
              // onChange={handleContentChange}
              onBlur={(value) => {
                setEditorContent(value);
              }}
            />
          </Box>
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
