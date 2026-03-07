import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
  PracticeQuestionRequest,
  PracticeQuestionType,
} from "@/entities/course/model/types";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Collapse from "@/shared/ui/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiCollapse from "@mui/material/Collapse";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  currentValues?: LessonDto;
  isCreation: boolean;
}

interface Question {
  id: string;
  questionType: PracticeQuestionType;
  questionText: string;
  trainerHint?: string;
  fullPoints: number;
  isHintVisible: boolean;
}

export default function EditTaskLessonForm({
  onSubmit,
  onCancel,
  currentValues,
  isCreation,
}: EditLessonFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePracticeLessonRequest>({
    defaultValues: isCreation
      ? {
          title: "",
          passingThresholdPercent: 90,
          lessonType: "PRACTICE_OPEN_ANSWER",
          questions: [],
        }
      : {
          title: currentValues?.title || "",
          passingThresholdPercent: currentValues?.passingThresholdPercent || 90,
          lessonType: "PRACTICE_OPEN_ANSWER",
          questions: currentValues?.questions || [],
        },
  });

  const title = watch("title");
  const passingThresholdPercent = watch("passingThresholdPercent");

  // Состояние для вопросов
  const [questions, setQuestions] = useState<Question[]>([]);

  // Инициализация вопросов из текущих значений
  useEffect(() => {
    if (currentValues?.questions) {
      const formattedQuestions = currentValues.questions.map((q) => ({
        id: uuidv4(),
        questionType: q.questionType,
        questionText: q.questionText,
        trainerHint: q.trainerHint,
        fullPoints: q.fullPoints || 1,
        isHintVisible: !!q.trainerHint, // Показываем поле, если есть подсказка
      }));

      setQuestions(formattedQuestions);
    }
  }, [currentValues?.questions]);

  // Обработчик добавления вопроса
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: uuidv4(),
        questionType: "OPEN_ANSWER",
        questionText: "",
        trainerHint: "",
        fullPoints: 1,
        isHintVisible: false,
      },
    ]);
  };

  // Обработчик удаления вопроса
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  // Обработчик изменения текста вопроса
  const handleQuestionTextChange = (questionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, questionText: text } : q
      )
    );
  };

  // Обработчик изменения подсказки тренера
  const handleTrainerHintChange = (questionId: string, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, trainerHint: text } : q
      )
    );
  };

  // Обработчик переключения видимости подсказки
  const handleToggleHint = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              isHintVisible: !q.isHintVisible,
              trainerHint: !q.isHintVisible ? "" : q.trainerHint,
            }
          : q
      )
    );
  };

  // Обработчик изменения баллов за правильный ответ
  const handleFullPointsChange = (questionId: string, value: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, fullPoints: value } : q
      )
    );
  };

  // Обработчик отправки формы
  const onSubmitForm = (lessonInfo: CreatePracticeLessonRequest) => {
    if (!lessonInfo.title.trim()) {
      setValue("title", lessonInfo.title.trim(), { shouldValidate: true });
      return;
    }

    if (
      !lessonInfo.passingThresholdPercent ||
      lessonInfo.passingThresholdPercent <= 0 ||
      lessonInfo.passingThresholdPercent > 100
    ) {
      return;
    }

    // Форматируем данные для отправки
    const formattedQuestions: PracticeQuestionRequest[] = questions.map(
      (q) => ({
        questionType: "OPEN_ANSWER",
        questionText: q.questionText,
        trainerHint: q.trainerHint?.trim() || undefined, // Отправляем только если есть значение
        fullPoints: q.fullPoints,
      })
    );

    onSubmit({
      ...lessonInfo,
      questions: formattedQuestions,
    });
  };

  // Проверка валидности вопросов (требуется хотя бы один вопрос с текстом)
  const areQuestionsValid =
    questions.length > 0 &&
    questions.every((question) => question.questionText.trim().length > 0);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitForm)}
      id="edit-open-answer-lesson-form"
    >
      <Stack spacing={3}>
        {/* Настройки */}
        <Collapse title="Настройки" defaultExpanded={true}>
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
                Порог прохождения
              </Typography>
              <TextField
                {...register("passingThresholdPercent", {
                  valueAsNumber: true,
                  required: "Порог прохождения обязателен",
                  min: { value: 1, message: "Минимум 1%" },
                  max: { value: 100, message: "Максимум 100%" },
                })}
                type="number"
                placeholder="Порог прохождения"
                fullWidth
                error={!!errors.passingThresholdPercent}
                helperText={
                  errors.passingThresholdPercent?.message ||
                  "Укажите процент, который должен набрать студент для успешного прохождения урока"
                }
              />
            </Box>
          </Stack>
        </Collapse>

        {/* Вопросы */}
        <Collapse title="Вопросы" defaultExpanded={true}>
          <Stack spacing={2}>
            {questions.map((question, index) => (
              <Box
                key={question.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Вопрос №{index + 1}</Typography>
                  <IconButton
                    onClick={() => handleDeleteQuestion(question.id)}
                    sx={{ color: "error.main" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Введите текст вопроса"
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(question.id, e.target.value)
                  }
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />

                {/* Поля для баллов */}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Typography variant="body1">Баллы</Typography>
                  <Typography variant="body2">Правильный ответ:</Typography>
                  <TextField
                    type="number"
                    value={question.fullPoints}
                    onChange={(e) =>
                      handleFullPointsChange(
                        question.id,
                        Number(e.target.value)
                      )
                    }
                    sx={{ flex: 1 }}
                  />
                </Box>

                {/* Кнопка для управления подсказкой */}
                <Button
                  variant="text"
                  onClick={() => handleToggleHint(question.id)}
                  sx={{ mb: 1, textTransform: "none", color: "primary.main" }}
                  startIcon={
                    <ExpandMoreIcon
                      sx={{
                        transform: question.isHintVisible
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        // transition: "transform 0.2s",
                      }}
                    />
                  }
                >
                  {question.isHintVisible
                    ? "Скрыть подсказку для тренера"
                    : "Добавить подсказку для тренера"}
                </Button>

                {/* Поле для подсказки (показывается по клику) */}
                <MuiCollapse in={question.isHintVisible}>
                  <TextField
                    fullWidth
                    placeholder="Введите подсказку для тренера"
                    value={question.trainerHint || ""}
                    onChange={(e) =>
                      handleTrainerHintChange(question.id, e.target.value)
                    }
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                  />
                </MuiCollapse>

                {!question.questionText.trim() && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Текст вопроса обязателен
                  </Alert>
                )}
              </Box>
            ))}

            {/* Кнопка добавления вопроса */}
            <Button
              variant="outlined"
              onClick={handleAddQuestion}
              startIcon={<AddIcon />}
              sx={{ mt: 1 }}
            >
              Добавить вопрос
            </Button>

            {questions.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Добавьте хотя бы один вопрос для создания урока
              </Alert>
            )}
          </Stack>
        </Collapse>

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
          <Button type="button" variant="outlined" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!areQuestionsValid}
          >
            {isCreation ? "Создать урок" : "Сохранить изменения"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
