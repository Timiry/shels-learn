import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { TestQuestion } from "./EditTestLessonForm";

interface TestQuestionFormProps {
  question: TestQuestion;
  index: number;
  handleDeleteQuestion: (questionId: string) => void;
  handleQuestionTextChange: (questionId: string, text: string) => void;
  handleAddOption: (questionId: string) => void;
  handleDeleteOption: (questionId: string, optionId: string) => void;
  handleOptionTextChange: (
    questionId: string,
    optionId: string,
    text: string
  ) => void;
  handleSingleChoiceChange: (
    questionId: string,
    selectedOptionId: string
  ) => void;
  handleMultipleChoiceChange: (
    questionId: string,
    optionId: string,
    isCorrect: boolean
  ) => void;
  handleFullPointsChange: (questionId: string, value: number) => void;
  handlePartialPointsChange: (questionId: string, value: number) => void;
  questionError: (question: TestQuestion) => string | null;
}

export default function TestQuestionForm({
  question,
  index,
  handleDeleteQuestion,
  handleQuestionTextChange,
  handleAddOption,
  handleDeleteOption,
  handleOptionTextChange,
  handleSingleChoiceChange,
  handleMultipleChoiceChange,
  handleFullPointsChange,
  handlePartialPointsChange,
  questionError,
}: TestQuestionFormProps) {
  return (
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
        onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      {/* Поля для баллов */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="body1">Баллы</Typography>
        <Typography variant="body2">Правильный:</Typography>
        <TextField
          type="number"
          value={question.fullPoints}
          onChange={(e) =>
            handleFullPointsChange(question.id, Number(e.target.value))
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
                handlePartialPointsChange(question.id, Number(e.target.value))
              }
              sx={{ flex: 1 }}
            />
          </>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        {question.questionType === "SINGLE_CHOICE" ? (
          // Радиогруппа для одиночного выбора
          <RadioGroup
            value={question.options.find((o) => o.isCorrect)?.id || ""}
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
                  onClick={() => handleDeleteOption(question.id, option.id)}
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
                  onClick={() => handleDeleteOption(question.id, option.id)}
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

      {questionError(question) && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {questionError(question)}
        </Alert>
      )}
    </Box>
  );
}
