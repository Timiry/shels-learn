import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemButton,
  ListItemAvatar,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { CourseDto } from "../model/programsApi";
import { useGetAllSectionsQuery } from "@/entities/section/model/sectionsApi";

interface ManageProgramCoursesProps {
  in: CourseDto[];
  notIn: CourseDto[];
  onSubmit: (orderCourseIds: number[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function ManageProgramCourses({
  in: itemsIn,
  notIn: itemsNotIn,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
}: ManageProgramCoursesProps) {
  const [enrolledItems, setEnrolledItems] = useState<CourseDto[]>([]);
  const [availableItems, setAvailableItems] = useState<CourseDto[]>([]);
  const [filteredAvailableItems, setFilteredAvailableItems] = useState<
    CourseDto[]
  >([]);
  const [sectionId, setSectionId] = useState(0);

  const { currentData: sections } = useGetAllSectionsQuery();

  // Инициализация списков
  useEffect(() => {
    setEnrolledItems(itemsIn);
    setAvailableItems(itemsNotIn);
    setFilteredAvailableItems(itemsNotIn);
  }, [itemsIn, itemsNotIn]);

  // Обработчик добавления элементов в список назначений
  const handleEnrollItem = (item: CourseDto) => {
    setEnrolledItems((prev) => [...prev, item]);
    setAvailableItems((prev) => prev.filter((u) => u.id !== item.id));
    filterCourses();
  };

  // Обработчик удаления элементов из списка назначений
  const handleUnenrollItem = (item: CourseDto) => {
    setAvailableItems((prev) => [...prev, item]);
    setEnrolledItems((prev) => prev.filter((u) => u.id !== item.id));
    filterCourses();
  };

  // фильтрация курсов по разделам
  const filterCourses = () => {
    if (sectionId === 0) {
      setFilteredAvailableItems(availableItems);
    } else {
      const list = availableItems.filter(
        (item) => item.sectionId === sectionId
      );
      setFilteredAvailableItems(list);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    // Определяем ID элементов, которые были добавлены
    const idsToEnroll = enrolledItems.map((u) => u.id);

    onSubmit(idsToEnroll);
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

          <Select
            onChange={(e) => {
              setSectionId(e.target.value as number);
              filterCourses();
            }}
            defaultValue={0}
          >
            <MenuItem value={0}>Все разделы</MenuItem>
            {sections?.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.title}
              </MenuItem>
            ))}
          </Select>

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
              {filteredAvailableItems.map((item) => (
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
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <ListItemButton onClick={() => handleEnrollItem(item)}>
                    +
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
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
              {enrolledItems.map((item, index) => (
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
                  <ListItemAvatar>{index + 1}</ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <ListItemButton
                    onClick={() => handleUnenrollItem(item)}
                    color="error"
                  >
                    -
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
