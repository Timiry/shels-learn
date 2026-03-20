import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { TaskQuestion } from "./EditTaskLessonForm";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiCollapse from "@mui/material/Collapse";

interface TaskQuestionFormProps {
  question: TaskQuestion;
  index: number;
  handleDeleteQuestion: (questionId: string) => void;
  handleQuestionTextChange: (questionId: string, text: string) => void;
  handleTrainerHintChange: (questionId: string, text: string) => void;
  handleToggleHint: (questionId: string) => void;
  handleFullPointsChange: (questionId: string, value: number) => void;
  handlePartialPointsChange: (questionId: string, value: number) => void;
  questionError: (question: TaskQuestion) => string | null;
}

export default function TaskQuestionForm({
  question,
  index,
  handleDeleteQuestion,
  handleQuestionTextChange,
  handleTrainerHintChange,
  handleToggleHint,
  handleFullPointsChange,
  handlePartialPointsChange,
  questionError,
}: TaskQuestionFormProps) {
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
        <Typography variant="body2">Полный:</Typography>
        <TextField
          type="number"
          value={question.fullPoints}
          onChange={(e) =>
            handleFullPointsChange(question.id, Number(e.target.value))
          }
          sx={{ flex: 1 }}
        />

        <Typography variant="body2">Частичный:</Typography>

        <TextField
          type="number"
          value={question.partialPoints || 0}
          onChange={(e) =>
            handlePartialPointsChange(question.id, Number(e.target.value))
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
          onChange={(e) => handleTrainerHintChange(question.id, e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
      </MuiCollapse>

      {questionError(question) && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {questionError(question)}
        </Alert>
      )}
    </Box>
  );
}
