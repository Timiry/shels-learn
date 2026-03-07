// components/ManageLists.tsx
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserDto } from "@/entities/user/model/usersApi";

interface ManageListProps {
  in: UserDto[];
  notIn: UserDto[];
  onSubmit: (lists: {
    idsToEnroll?: number[];
    idsToUnenroll?: number[];
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ManageLists({
  in: usersIn,
  notIn: usersNotIn,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: ManageListProps) {
  const [selectedIn, setSelectedIn] = useState<number[]>([]);
  const [selectedNotIn, setSelectedNotIn] = useState<number[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<UserDto[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserDto[]>([]);

  // Инициализация списков
  useEffect(() => {
    setEnrolledUsers(usersIn);
    setAvailableUsers(usersNotIn);
  }, [usersIn, usersNotIn]);

  // Обработчик выбора пользователя в списке "доступные"
  const handleNotInSelection = (userId: number) => {
    setSelectedNotIn((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Обработчик выбора пользователя в списке "назначены"
  const handleInSelection = (userId: number) => {
    setSelectedIn((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Обработчик добавления пользователей в список назначений
  const handleEnrollUsers = () => {
    if (selectedNotIn.length === 0) return;

    const usersToEnroll = availableUsers.filter((u) =>
      selectedNotIn.includes(u.id!)
    );

    setEnrolledUsers((prev) => [...prev, ...usersToEnroll]);
    setAvailableUsers((prev) =>
      prev.filter((u) => !selectedNotIn.includes(u.id!))
    );
    setSelectedNotIn([]);
  };

  // Обработчик удаления пользователей из списка назначений
  const handleUnenrollUsers = () => {
    if (selectedIn.length === 0) return;

    const usersToUnenroll = enrolledUsers.filter((u) =>
      selectedIn.includes(u.id!)
    );

    setAvailableUsers((prev) => [...prev, ...usersToUnenroll]);
    setEnrolledUsers((prev) => prev.filter((u) => !selectedIn.includes(u.id!)));
    setSelectedIn([]);
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    // Определяем ID пользователей, которые были добавлены/удалены
    const idsToEnroll = enrolledUsers
      .filter((u) => !usersIn.some((inUser) => inUser.id === u.id))
      .map((u) => u.id!);

    const idsToUnenroll = usersIn
      .filter(
        (u) => !enrolledUsers.some((enrolledUser) => enrolledUser.id === u.id)
      )
      .map((u) => u.id!);

    onSubmit({ idsToEnroll, idsToUnenroll });
  };

  return (
    <Box p={"21px 28px"}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
          pb: "21px",
        }}
      >
        <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
          Отмена
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Сохранить изменения"
          )}
        </Button>
      </Box>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Список "доступные к назначению" */}
        <Box sx={{ flex: 1, mr: 2, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1">
            Доступные к назначению ({availableUsers.length})
          </Typography>

          <Box
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "auto",
            }}
          >
            <List sx={{ p: 0 }}>
              {availableUsers.map((user) => (
                <ListItem
                  key={user.id}
                  disablePadding
                  sx={{
                    px: 2,
                    py: 1.5,
                    "&:hover": { bgcolor: "background.default" },
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Checkbox
                    checked={selectedNotIn.includes(user.id!)}
                    onChange={() => handleNotInSelection(user.id!)}
                    color="primary"
                  />
                  <ListItemText
                    primary={user.fullName}
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Кнопки управления */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mx: 2,
          }}
        >
          <IconButton
            onClick={handleEnrollUsers}
            disabled={selectedNotIn.length === 0 || isLoading}
            sx={{
              bgcolor: "background.default",
              "&:hover": { bgcolor: "action.hover" },
              boxShadow: 1,
              p: 1.5,
              borderRadius: 1,
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 24 }} />
          </IconButton>

          <IconButton
            onClick={handleUnenrollUsers}
            disabled={selectedIn.length === 0 || isLoading}
            sx={{
              bgcolor: "background.default",
              "&:hover": { bgcolor: "action.hover" },
              boxShadow: 1,
              p: 1.5,
              borderRadius: 1,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>

        {/* Список "назначены" */}
        <Box sx={{ flex: 1, ml: 2, display: "flex", flexDirection: "column" }}>
          <Typography variant="subtitle1">
            Назначены ({enrolledUsers.length})
          </Typography>

          <Box
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "auto",
            }}
          >
            <List sx={{ p: 0 }}>
              {enrolledUsers.map((user) => (
                <ListItem
                  key={user.id}
                  disablePadding
                  sx={{
                    px: 2,
                    py: 1.5,
                    "&:hover": { bgcolor: "background.default" },
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Checkbox
                    checked={selectedIn.includes(user.id!)}
                    onChange={() => handleInSelection(user.id!)}
                    color="primary"
                  />
                  <ListItemText
                    primary={user.fullName}
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
