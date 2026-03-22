import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ManageAnyListProps<
  T extends
    | { id: number; title: string }
    | { id: number; fullName: string; email: string },
> {
  in: T[];
  notIn: T[];
  onSubmit: (listIn: number[], listNotIn: number[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ManageAnyLists<
  T extends
    | { id: number; title: string }
    | { id: number; fullName: string; email: string },
>({
  in: itemsIn,
  notIn: itemsNotIn,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: ManageAnyListProps<T>) {
  const [selectedIn, setSelectedIn] = useState<number[]>([]);
  const [selectedNotIn, setSelectedNotIn] = useState<number[]>([]);
  const [enrolledItems, setEnrolledItems] = useState<T[]>([]);
  const [availableItems, setAvailableItems] = useState<T[]>([]);

  // Инициализация списков
  useEffect(() => {
    setEnrolledItems(itemsIn);
    setAvailableItems(itemsNotIn);
  }, [itemsIn, itemsNotIn]);

  // Обработчик выбора элемента в списке "доступные"
  const handleNotInSelection = (itemId: number) => {
    setSelectedNotIn((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Обработчик выбора элемента в списке "назначены"
  const handleInSelection = (itemId: number) => {
    setSelectedIn((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Обработчик добавления элементов в список назначений
  const handleEnrollItems = () => {
    if (selectedNotIn.length === 0) return;

    const itemsToEnroll = availableItems.filter((u) =>
      selectedNotIn.includes(u.id!)
    );

    setEnrolledItems((prev) => [...prev, ...itemsToEnroll]);
    setAvailableItems((prev) =>
      prev.filter((u) => !selectedNotIn.includes(u.id!))
    );
    setSelectedNotIn([]);
  };

  // Обработчик удаления элементов из списка назначений
  const handleUnenrollItems = () => {
    if (selectedIn.length === 0) return;

    const itemsToUnenroll = enrolledItems.filter((u) =>
      selectedIn.includes(u.id!)
    );

    setAvailableItems((prev) => [...prev, ...itemsToUnenroll]);
    setEnrolledItems((prev) => prev.filter((u) => !selectedIn.includes(u.id!)));
    setSelectedIn([]);
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    // Определяем ID элементов, которые были добавлены/удалены
    const idsToEnroll = enrolledItems
      .filter((u) => !itemsIn.some((inItem) => inItem.id === u.id))
      .map((u) => u.id!);

    const idsToUnenroll = itemsIn
      .filter(
        (u) => !enrolledItems.some((enrolledItem) => enrolledItem.id === u.id)
      )
      .map((u) => u.id!);

    onSubmit(idsToEnroll, idsToUnenroll);
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
            Доступные к назначению ({availableItems.length})
          </Typography>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              height: "calc(100vh - 230px)",
              overflow: "auto",
            }}
          >
            <List sx={{ p: 0 }}>
              {availableItems.map((item) => (
                <ListItem
                  key={item.id}
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
                    checked={selectedNotIn.includes(item.id!)}
                    onChange={() => handleNotInSelection(item.id!)}
                    color="primary"
                  />
                  <ListItemText
                    primary={"title" in item ? item.title : item.fullName}
                    secondary={"email" in item ? item.email : ""}
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
            onClick={handleEnrollItems}
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
            onClick={handleUnenrollItems}
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
            Назначены ({enrolledItems.length})
          </Typography>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              height: "calc(100vh - 230px)",
              overflow: "auto",
            }}
          >
            <List sx={{ p: 0 }}>
              {enrolledItems.map((item) => (
                <ListItem
                  key={item.id}
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
                    checked={selectedIn.includes(item.id!)}
                    onChange={() => handleInSelection(item.id!)}
                    color="primary"
                  />
                  <ListItemText
                    primary={"title" in item ? item.title : item.fullName}
                    secondary={"email" in item ? item.email : ""}
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
