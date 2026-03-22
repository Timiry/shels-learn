import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Alert,
  Stack,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { CourseDto } from "../model/programsApi";
import { useGetAllSectionsQuery } from "@/entities/section/model/sectionsApi";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ManageProgramCoursesProps {
  in: CourseDto[];
  notIn: CourseDto[];
  onSubmit: (orderCourseIds: number[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// Кастомный сортируемый элемент
interface SortableItemProps {
  id: number;
  course: CourseDto;
  index: number;
  onRemove: (course: CourseDto) => void;
  sections: any[];
}

const SortableCourseItem = ({
  id,
  course,
  index,
  onRemove,
  sections,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? "action.hover" : "transparent",
  };

  return (
    <ListItem
      ref={setNodeRef}
      {...attributes}
      style={style}
      disablePadding
      sx={{
        px: 2,
        py: 1.5,
        "&:hover": { bgcolor: "background.default" },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <IconButton {...listeners} size="small" sx={{ mr: 1, cursor: "grab" }}>
        <DragIndicatorIcon fontSize="small" color="action" />
      </IconButton>

      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "1",
          bgcolor: "primary.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          mr: 2,
        }}
      >
        {index + 1}
      </Box>

      <ListItemText
        primary={course.title}
        secondary={sections?.find((s) => s.id === course.sectionId)?.title}
        primaryTypographyProps={{ fontWeight: 500 }}
        secondaryTypographyProps={{
          variant: "caption",
          color: "text.secondary",
        }}
      />

      <IconButton
        onClick={() => onRemove(course)}
        color="error"
        size="small"
        sx={{ ml: 1 }}
      >
        <RemoveOutlinedIcon />
      </IconButton>
    </ListItem>
  );
};

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
  const [sectionId, setSectionId] = useState<number>(0);

  const { currentData: sections, isLoading: isSectionsLoading } =
    useGetAllSectionsQuery();

  // Инициализация списков при изменении пропсов
  useEffect(() => {
    setEnrolledItems(itemsIn);
    setAvailableItems(itemsNotIn);
  }, [itemsIn, itemsNotIn]);

  // Автоматическая пересортировка при изменении фильтра или списка
  useEffect(() => {
    if (sectionId === 0) {
      setFilteredAvailableItems(availableItems);
    } else {
      setFilteredAvailableItems(
        availableItems.filter((item) => item.sectionId === sectionId)
      );
    }
  }, [availableItems, sectionId]);

  // Настройка сенсоров для drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Обработчик завершения перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEnrolledItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Обработчик добавления элементов в список назначений
  const handleEnrollItem = useCallback((item: CourseDto) => {
    setEnrolledItems((prev) => [...prev, item]);
    setAvailableItems((prev) => prev.filter((u) => u.id !== item.id));
  }, []);

  // Обработчик удаления элементов из списка назначений
  const handleUnenrollItem = useCallback((item: CourseDto) => {
    setAvailableItems((prev) => [...prev, item]);
    setEnrolledItems((prev) => prev.filter((u) => u.id !== item.id));
  }, []);

  // Обработчик отправки формы
  const handleSubmit = () => {
    const idsToEnroll = enrolledItems.map((u) => u.id);
    onSubmit(idsToEnroll);
  };

  return (
    <Box p={"21px 28px"}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          pb: "21px",
        }}
      >
        <Select
          value={sectionId}
          onChange={(e) => setSectionId(Number(e.target.value))}
          displayEmpty
          sx={{ width: "400px" }}
        >
          <MenuItem value={0}>Все разделы</MenuItem>
          {isSectionsLoading ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            sections?.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.title}
              </MenuItem>
            ))
          )}
        </Select>

        <Box>
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Отмена
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ ml: 2 }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, height: "calc(100vh - 280px)" }}>
        {/* Список "доступные к назначению" */}
        <Paper
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              p: 2,
              pb: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Доступные к назначению ({filteredAvailableItems.length} из{" "}
              {availableItems.length})
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {isSectionsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredAvailableItems.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                {availableItems.length === 0
                  ? "Нет доступных курсов"
                  : "Нет курсов в выбранном разделе"}
              </Box>
            ) : (
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
                      secondary={
                        sections?.find((s) => s.id === item.sectionId)?.title
                      }
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{
                        variant: "caption",
                        color: "text.secondary",
                      }}
                    />
                    <IconButton
                      onClick={() => handleEnrollItem(item)}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <AddOutlinedIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Paper>

        {/* Список "назначены" с поддержкой drag-and-drop */}
        <Paper
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              p: 2,
              pb: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" alignItems="center" gap={1}>
              <Typography variant="subtitle1" fontWeight={600}>
                Назначены ({enrolledItems.length})
              </Typography>
              {enrolledItems.length > 1 && (
                <Typography variant="caption" color="text.secondary">
                  Перетащите курс для изменения порядка
                </Typography>
              )}
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflow: "auto" }}>
            {enrolledItems.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                Нет назначенных курсов
              </Box>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={enrolledItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <List sx={{ p: 0 }}>
                    {enrolledItems.map((item, index) => (
                      <SortableCourseItem
                        key={item.id}
                        id={item.id}
                        course={item}
                        index={index}
                        onRemove={handleUnenrollItem}
                        sections={sections || []}
                      />
                    ))}
                  </List>
                </SortableContext>
              </DndContext>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
