import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Menu,
  MenuItem,
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
import AddIcon from "@mui/icons-material/Add";
import Collapse from "@/shared/ui/Collapse";
import TestQuestionForm from "./TestQuestionForm";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;
  currentValues?: LessonDto;
  isCreation: boolean;
}

export interface TestQuestion {
  id: string;
  idForServer?: number;
  questionType: PracticeQuestionType;
  questionText: string;
  options: Option[];
  fullPoints: number;
  partialPoints?: number;
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export default function EditTestLessonForm({
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
          lessonType: "PRACTICE_TEST",
          questions: [],
          shuffleOptions: false,
          stopLesson: false,
          showQuestionStatus: true,
          showCorrectAnswersAfterCompletion: false,
        }
      : {
          title: currentValues?.title || "",
          passingThresholdPercent: currentValues?.passingThresholdPercent || 90,
          lessonType: "PRACTICE_TEST",
          questions: currentValues?.questions || [],
          stopLesson: currentValues?.stopLesson,
          attemptLimit: currentValues?.attemptLimit,
          timeLimitMinutes: currentValues?.timeLimitMinutes,
          shuffleOptions: currentValues?.shuffleOnEveryAttempt,
          showQuestionStatus: true,
          showCorrectAnswersAfterCompletion:
            currentValues?.showCorrectAnswersAfterCompletion,
        },
  });

  const stopLesson = watch("stopLesson");
  const shuffleOptions = watch("shuffleOptions");
  const showCorrectAnswersAfterCompletion = watch(
    "showCorrectAnswersAfterCompletion"
  );

  // Состояние для вопросов
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [addQuestionMenuAnchor, setAddQuestionMenuAnchor] =
    useState<null | HTMLElement>(null);

  // Инициализация вопросов из текущих значений
  useEffect(() => {
    if (currentValues?.questions) {
      const formattedQuestions = currentValues.questions.map((q) => ({
        id: uuidv4(),
        idForServer: q.id || undefined,
        questionType: q.questionType,
        questionText: q.questionText,
        options: q.options
          ? q.options.map((option, index) => ({
              id: uuidv4(),
              text: option,
              isCorrect: (q.correctAnswers || []).includes(option),
            }))
          : [],
        fullPoints: q.fullPoints || 1,
        partialPoints: q.partialPoints,
      }));

      setQuestions(formattedQuestions);
    }
  }, [currentValues?.questions]);

  // Обработчик добавления вопроса
  const handleAddQuestion = useCallback(
    (questionType: PracticeQuestionType) => {
      setQuestions((prev) => [
        ...prev,
        {
          id: uuidv4(),
          questionType,
          questionText: "",
          options: [
            { id: uuidv4(), text: "", isCorrect: true },
            { id: uuidv4(), text: "", isCorrect: false },
          ],
          fullPoints: 1,
          partialPoints: questionType === "MULTIPLE_CHOICE" ? 0 : undefined,
        },
      ]);

      setAddQuestionMenuAnchor(null);
    },
    []
  );

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

  // Обработчик добавления варианта ответа
  const handleAddOption = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          options: [...q.options, { id: uuidv4(), text: "", isCorrect: false }],
        };
      })
    );
  }, []);

  // Обработчик удаления варианта ответа
  const handleDeleteOption = useCallback(
    (questionId: string, optionId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          // Не удаляем последний вариант ответа
          if (q.options.length <= 2) return q;
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          };
        })
      );
    },
    []
  );

  // Обработчик изменения текста варианта ответа
  const handleOptionTextChange = useCallback(
    (questionId: string, optionId: string, text: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optionId ? { ...o, text } : o
            ),
          };
        })
      );
    },
    []
  );

  // Обработчик изменения состояния правильного ответа для одиночного выбора
  const handleSingleChoiceChange = useCallback(
    (questionId: string, selectedOptionId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId || q.questionType !== "SINGLE_CHOICE")
            return q;
          return {
            ...q,
            options: q.options.map((o) => ({
              ...o,
              isCorrect: o.id === selectedOptionId,
            })),
          };
        })
      );
    },
    []
  );

  // Обработчик изменения состояния правильного ответа для множественного выбора
  const handleMultipleChoiceChange = useCallback(
    (questionId: string, optionId: string, isCorrect: boolean) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId || q.questionType !== "MULTIPLE_CHOICE")
            return q;
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optionId ? { ...o, isCorrect } : o
            ),
          };
        })
      );
    },
    []
  );

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
    // Форматируем данные для отправки
    const formattedQuestions: PracticeQuestionRequest[] = questions.map(
      (q, index) => {
        const baseQuestion = {
          id: q.idForServer,
          position: index + 1,
          questionType: q.questionType,
          questionText: q.questionText,
          options: q.options.map((o) => o.text),
          correctAnswers: q.options
            .filter((o) => o.isCorrect)
            .map((o) => o.text),
          fullPoints: q.fullPoints,
        };

        // Для одиночного выбора не отправляем partialPoints
        if (q.questionType === "SINGLE_CHOICE") {
          return baseQuestion;
        }

        // Для множественного выбора отправляем partialPoints, если есть
        return q.partialPoints
          ? { ...baseQuestion, partialPoints: q.partialPoints }
          : baseQuestion;
      }
    );

    onSubmit({
      ...lessonInfo,
      questions: formattedQuestions,
    });
  };

  // Проверка валидности вопросов
  const questionError = (question: TestQuestion) => {
    if (question.questionText == "")
      return "Текст вопроса должен быть заполнен";
    if (question.options.find((o) => o.text === ""))
      return "Текст варианта ответа должен быть заполнен";

    const correctAnswersCount = question.options.filter(
      (o) => o.isCorrect
    ).length;
    if (
      question.questionType === "SINGLE_CHOICE" &&
      correctAnswersCount !== 1
    ) {
      return "Должен быть ровно 1 правильный ответ";
    }
    if (
      question.questionType === "MULTIPLE_CHOICE" &&
      correctAnswersCount < 1
    ) {
      return "Должен быть как минимум 1 правильный ответ";
    }

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
    <Box component="form" onSubmit={handleSubmit(onSubmitForm)}>
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
                  required: "Порог прохождения обязателен",
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
                  "Укажите процент от максимальных баллов, который должен набрать студент для успешного прохождения урока"
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

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={shuffleOptions}
                    onChange={(e) =>
                      setValue("shuffleOptions", e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography>Перемешивание вариантов ответа</Typography>
                    <Typography variant="body2">
                      Варианты ответов теста у студента будут отображаться в
                      случайном порядке
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={showCorrectAnswersAfterCompletion}
                    onChange={(e) =>
                      setValue(
                        "showCorrectAnswersAfterCompletion",
                        e.target.checked
                      )
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography>Показывать правильные ответы</Typography>
                    <Typography variant="body2">
                      После завершения тестов студент будет видеть, какие
                      варианты ответов были правильными
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
              <TestQuestionForm
                key={question.id}
                question={question}
                index={index}
                handleDeleteQuestion={handleDeleteQuestion}
                handleQuestionTextChange={handleQuestionTextChange}
                handleAddOption={handleAddOption}
                handleDeleteOption={handleDeleteOption}
                handleOptionTextChange={handleOptionTextChange}
                handleSingleChoiceChange={handleSingleChoiceChange}
                handleMultipleChoiceChange={handleMultipleChoiceChange}
                handleFullPointsChange={handleFullPointsChange}
                handlePartialPointsChange={handlePartialPointsChange}
                questionError={questionError}
              />
            ))}

            {/* Кнопка добавления вопроса */}
            <Button
              variant="outlined"
              onClick={(e) => setAddQuestionMenuAnchor(e.currentTarget)}
              startIcon={<AddIcon />}
              sx={{ mt: 1 }}
            >
              Добавить вопрос
            </Button>

            <Menu
              anchorEl={addQuestionMenuAnchor}
              open={Boolean(addQuestionMenuAnchor)}
              onClose={() => setAddQuestionMenuAnchor(null)}
            >
              <MenuItem onClick={() => handleAddQuestion("SINGLE_CHOICE")}>
                Одиночный выбор
              </MenuItem>
              <MenuItem onClick={() => handleAddQuestion("MULTIPLE_CHOICE")}>
                Множественный выбор
              </MenuItem>
            </Menu>
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
