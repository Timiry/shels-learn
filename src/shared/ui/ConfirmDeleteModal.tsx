"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

type ObjectType = "user" | "course" | "lesson" | "section" | "group"; //TODO: дополнить всеми типами сущностей

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  objectType: ObjectType;
  objectname: string;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  objectType,
  objectname,
}: ConfirmDeleteModalProps) {
  const words = {
    user: ["пользователя", "Пользователь"],
    course: ["курса", "Курс"],
    lesson: ["урока", "Урок"],
    section: ["раздела", "Раздел"],
    group: ["группы", "Группа"],
    //TODO: дополнить всеми типами сущностей
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogContent
        sx={{
          textAlign: "center",
          py: 4,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <DeleteOutline sx={{ fontSize: 60 }} />
        </Box>

        <Typography variant="h6" component="h2" mb={1}>
          Удаление {words[objectType][0]}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          {words[objectType][1]} {objectname} будет безвозвратно удален. Вы
          уверены?
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
          }}
        >
          Отменить
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 1,
          }}
        >
          Удалить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
