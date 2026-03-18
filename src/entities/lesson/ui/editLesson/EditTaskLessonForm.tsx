import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
  PracticeQuestionRequest,
  PracticeQuestionType,
} from "@/entities/course/model/coursesApi";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Collapse from "@/shared/ui/Collapse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiCollapse from "@mui/material/Collapse";
import TaskQuestionForm from "./TaskQuestionForm";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  currentValues?: LessonDto;
  isCreation: boolean;
}

export interface TaskQuestion {
  id: string;
  idForServer?: number;
  questionType: PracticeQuestionType;
  questionText: string;
  trainerHint?: string;
  fullPoints: number;
  partialPoints: number;
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
          lessonType: "PRACTICE_OPEN_ANSWER",
          questions: [],
          stopLesson: false,
          showQuestionStatus: true,
        }
      : {
          title: currentValues?.title || "",
          passingThresholdPercent: currentValues?.passingThresholdPercent || 90,
          lessonType: "PRACTICE_OPEN_ANSWER",
          questions: currentValues?.questions || [],
          stopLesson: currentValues?.stopLesson,
          attemptLimit: currentValues?.attemptLimit,
          timeLimitMinutes: currentValues?.timeLimitMinutes,
          showQuestionStatus: true,
        },
  });

  const stopLesson = watch("stopLesson");

  // Состояние для вопросов
  const [questions, setQuestions] = useState<TaskQuestion[]>([]);

  // Инициализация вопросов из текущих значений
  useEffect(() => {
    if (currentValues?.questions) {
      const formattedQuestions = currentValues.questions.map((q) => ({
        id: uuidv4(),
        idForServer: q.id,
        questionType: q.questionType,
        questionText: q.questionText,
        trainerHint: q.trainerHint,
        fullPoints: q.fullPoints || 1,
        partialPoints: q.partialPoints || 0,
        isHintVisible: !!q.trainerHint, // Показываем поле, если есть подсказка
      }));

      setQuestions(formattedQuestions);
    }
  }, [currentValues?.questions]);

  // Обработчик добавления вопроса
  const handleAddQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      {
        id: uuidv4(),
        idForServer: undefined,
        questionType: "OPEN_ANSWER",
        questionText: "",
        trainerHint: "",
        fullPoints: 1,
        partialPoints: 0,
        isHintVisible: false,
      },
    ]);
  }, []);

  // Обработчик удаления вопроса
  const handleDeleteQuestion = useCallback((questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }, []);

  // Обработчик изменения текста вопроса
  const handleQuestionTextChange = useCallback(
    (questionId: string, text: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, questionText: text } : q
        )
      );
    },
    []
  );

  // Обработчик изменения подсказки тренера
  const handleTrainerHintChange = useCallback(
    (questionId: string, text: string) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, trainerHint: text } : q))
      );
    },
    []
  );

  // Обработчик переключения видимости подсказки
  const handleToggleHint = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              isHintVisible: !q.isHintVisible,
              trainerHint: !q.isHintVisible ? "" : q.trainerHint,
            }
          : q
      )
    );
  }, []);

  // Обработчик изменения баллов за правильный ответ
  const handleFullPointsChange = useCallback(
    (questionId: string, value: number) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, fullPoints: value } : q))
      );
    },
    []
  );

  // Обработчик изменения баллов за частичный ответ
  const handlePartialPointsChange = useCallback(
    (questionId: string, value: number) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, partialPoints: value } : q
        )
      );
    },
    []
  );

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
      (q, index) => ({
        id: q.idForServer,
        position: index + 1,
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

  // Проверка валидности вопросов
  const questionError = (question: TaskQuestion) => {
    if (question.questionText == "")
      return "Текст вопроса должен быть заполнен";
    if (
      question.fullPoints <= 0 ||
      (question.partialPoints && question.partialPoints < 0)
    )
      return "Баллы должны быть положитеьными и полный балл больше нуля";
    if (
      question.fullPoints &&
      question.partialPoints &&
      question.fullPoints <= question.partialPoints
    )
      return "Баллы за частичный ответ должны быть меньше чем баллы за полный";

    return null;
  };

  const areAllQuestionsValid =
    questions.length > 0 &&
    questions.every((question) => questionError(question) === null);

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

            <Box>
              <Typography variant="body1" gutterBottom>
                Ограничение попыток
              </Typography>
              <TextField
                {...register("attemptLimit", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Минимум 1 попытка" },
                })}
                type="number"
                placeholder="Количество попыток (оставьте пустым для неограниченного количества)"
                fullWidth
                error={!!errors.attemptLimit}
                helperText={errors.attemptLimit?.message}
              />
            </Box>

            <Box>
              <Typography variant="body1" gutterBottom>
                Ограничение времени выполнения (в минутах)
              </Typography>
              <TextField
                {...register("timeLimitMinutes", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Минимум 1 минута" },
                })}
                type="number"
                placeholder="Время на выполнение (оставьте пустым для неограниченного времени)"
                fullWidth
                error={!!errors.timeLimitMinutes}
                helperText={errors.timeLimitMinutes?.message}
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={stopLesson}
                    onChange={(e) => setValue("stopLesson", e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography>Стоп-урок</Typography>
                    <Typography variant="body2">
                      Студент сможет перейти к следующему уроку только после
                      того как успешно пройдет этот
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Stack>
        </Collapse>

        {/* Вопросы */}
        <Collapse title="Вопросы" defaultExpanded={true}>
          <Stack spacing={2}>
            {questions.map((question, index) => (
              <TaskQuestionForm
                key={question.id}
                question={question}
                index={index}
                handleDeleteQuestion={handleDeleteQuestion}
                handleQuestionTextChange={handleQuestionTextChange}
                handleTrainerHintChange={handleTrainerHintChange}
                handleToggleHint={handleToggleHint}
                handleFullPointsChange={handleFullPointsChange}
                handlePartialPointsChange={handlePartialPointsChange}
                questionError={questionError}
              />
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
            disabled={!areAllQuestionsValid}
          >
            {isCreation ? "Создать урок" : "Сохранить изменения"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
