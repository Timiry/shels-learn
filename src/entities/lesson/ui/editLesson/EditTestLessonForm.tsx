import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  Radio,
  RadioGroup,
  IconButton,
  Menu,
  MenuItem,
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
        }
      : {
          title: currentValues?.title || "",
          passingThresholdPercent: currentValues?.passingThresholdPercent || 90,
          lessonType: "PRACTICE_TEST",
          questions: currentValues?.questions || [],
        },
  });

  const title = watch("title");
  const passingThresholdPercent = watch("passingThresholdPercent");

  // Состояние для вопросов
  const [questions, setQuestions] = useState<Question[]>([]);
  const [addQuestionMenuAnchor, setAddQuestionMenuAnchor] =
    useState<null | HTMLElement>(null);

  // Инициализация вопросов из текущих значений
  useEffect(() => {
    if (currentValues?.questions) {
      const formattedQuestions = currentValues.questions.map((q) => ({
        id: uuidv4(),
        questionType: q.questionType,
        questionText: q.questionText,
        options: q.options.map((option, index) => ({
          id: uuidv4(),
          text: option,
          isCorrect: (q.correctAnswers || []).includes(option),
        })),
        fullPoints: q.fullPoints || 1,
        partialPoints: q.partialPoints,
      }));

      setQuestions(formattedQuestions);
    }
  }, [currentValues?.questions]);

  // Обработчик добавления вопроса
  const handleAddQuestion = (questionType: PracticeQuestionType) => {
    setQuestions([
      ...questions,
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

  // Обработчик добавления варианта ответа
  const handleAddOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: [...q.options, { id: uuidv4(), text: "", isCorrect: false }],
        };
      })
    );
  };

  // Обработчик удаления варианта ответа
  const handleDeleteOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        // Не удаляем последний вариант ответа
        if (q.options.length <= 2) return q;

        return {
          ...q,
          options: q.options.filter((o) => o.id !== optionId),
        };
      })
    );
  };

  // Обработчик изменения текста варианта ответа
  const handleOptionTextChange = (
    questionId: string,
    optionId: string,
    text: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          options: q.options.map((o) =>
            o.id === optionId ? { ...o, text } : o
          ),
        };
      })
    );
  };

  // Обработчик изменения состояния правильного ответа для одиночного выбора
  const handleSingleChoiceChange = (
    questionId: string,
    selectedOptionId: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== questionId || q.questionType !== "SINGLE_CHOICE") return q;

        return {
          ...q,
          options: q.options.map((o) => ({
            ...o,
            isCorrect: o.id === selectedOptionId,
          })),
        };
      })
    );
  };

  // Обработчик изменения состояния правильного ответа для множественного выбора
  const handleMultipleChoiceChange = (
    questionId: string,
    optionId: string,
    isCorrect: boolean
  ) => {
    setQuestions(
      questions.map((q) => {
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
  };

  // Обработчик изменения баллов за правильный ответ
  const handleFullPointsChange = (questionId: string, value: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, fullPoints: value } : q
      )
    );
  };

  // Обработчик изменения баллов за частичный ответ
  const handlePartialPointsChange = (questionId: string, value: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, partialPoints: value } : q
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
    const formattedQuestions: PracticeQuestionRequest[] = questions.map((q) => {
      const baseQuestion = {
        questionType: q.questionType,
        questionText: q.questionText,
        options: q.options.map((o) => o.text),
        correctAnswers: q.options.filter((o) => o.isCorrect).map((o) => o.text),
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
    });

    onSubmit({
      ...lessonInfo,
      questions: formattedQuestions,
    });
  };

  // Проверка валидности вопросов
  const areQuestionsValid = questions.every((question) => {
    const correctAnswersCount = question.options.filter(
      (o) => o.isCorrect
    ).length;

    // Для SINGLE_CHOICE должно быть ровно 1 правильный ответ
    if (question.questionType === "SINGLE_CHOICE") {
      return correctAnswersCount === 1;
    }

    // Для MULTIPLE_CHOICE должно быть как минимум 1 правильный ответ
    return correctAnswersCount >= 1;
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmitForm)}
      id="edit-practice-lesson-form"
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
                inputProps={{ min: 1, max: 100 }}
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
                  <Typography variant="body2">Правильный:</Typography>
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
                  {question.questionType === "MULTIPLE_CHOICE" && (
                    <>
                      <Typography variant="body2">Частичный:</Typography>

                      <TextField
                        type="number"
                        value={question.partialPoints || 0}
                        onChange={(e) =>
                          handlePartialPointsChange(
                            question.id,
                            Number(e.target.value)
                          )
                        }
                        inputProps={{ max: question.fullPoints }}
                        sx={{ flex: 1 }}
                      />
                    </>
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  {question.questionType === "SINGLE_CHOICE" ? (
                    // Радиогруппа для одиночного выбора
                    <RadioGroup
                      value={
                        question.options.find((o) => o.isCorrect)?.id || ""
                      }
                      onChange={(e) =>
                        handleSingleChoiceChange(question.id, e.target.value)
                      }
                    >
                      {question.options.map((option) => (
                        <Box
                          key={option.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            p: 1,
                            backgroundColor: "background.default",
                            borderRadius: 1,
                          }}
                        >
                          <Radio value={option.id} />
                          <TextField
                            fullWidth
                            placeholder={`Вариант ответа`}
                            value={option.text}
                            onChange={(e) =>
                              handleOptionTextChange(
                                question.id,
                                option.id,
                                e.target.value
                              )
                            }
                            sx={{ ml: 1 }}
                          />
                          <IconButton
                            onClick={() =>
                              handleDeleteOption(question.id, option.id)
                            }
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </RadioGroup>
                  ) : (
                    // Чекбоксы для множественного выбора
                    <Box>
                      {question.options.map((option) => (
                        <Box
                          key={option.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                            p: 1,
                            backgroundColor: "background.default",
                            borderRadius: 1,
                          }}
                        >
                          <Checkbox
                            checked={option.isCorrect}
                            onChange={(e) =>
                              handleMultipleChoiceChange(
                                question.id,
                                option.id,
                                e.target.checked
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            placeholder={`Вариант ответа`}
                            value={option.text}
                            onChange={(e) =>
                              handleOptionTextChange(
                                question.id,
                                option.id,
                                e.target.value
                              )
                            }
                            sx={{ ml: 1 }}
                          />
                          <IconButton
                            onClick={() =>
                              handleDeleteOption(question.id, option.id)
                            }
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  variant="outlined"
                  onClick={() => handleAddOption(question.id)}
                  sx={{ mb: 2 }}
                  startIcon={<AddIcon />}
                >
                  Добавить вариант ответа
                </Button>

                {!areQuestionsValid && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {question.questionType === "SINGLE_CHOICE"
                      ? "Должен быть ровно 1 правильный ответ"
                      : "Должен быть как минимум 1 правильный ответ"}
                  </Alert>
                )}
              </Box>
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
            disabled={!areQuestionsValid}
          >
            {isCreation ? "Создать урок" : "Сохранить изменения"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
