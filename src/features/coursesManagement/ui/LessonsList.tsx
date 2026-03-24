// features/course-management/ui/LessonsList.tsx
import { LessonDto } from "@/entities/course/model/coursesApi";
import {
  Box,
  Button,
  List,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import IconBorderWrapper from "@/shared/ui/IconBorderWrapper";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useUpdateCourseMutation } from "@/entities/course/model/coursesApi";
import { CourseDto } from "@/entities/course/model/coursesApi";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface LessonsListProps {
  activeLessonId?: number;
  lessons: LessonDto[];
  onLessonClick: (lessonId: number | undefined) => void; // ✅ Исправлена опечатка: Clik → Click
  onCreateLessonClick: () => void; // ✅ Исправлена опечатка: Clik → Click
  courseInfo: CourseDto;
}

export default function LessonsList({
  activeLessonId,
  lessons,
  onLessonClick,
  onCreateLessonClick,
  courseInfo,
}: LessonsListProps) {
  const [orderedLessons, setOrderedLessons] = useState<LessonDto[]>(lessons);
  const [isReordering, setIsReordering] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Добавлен реф для отслеживания состояния перетаскивания
  const isDraggingRef = useRef(false);

  const [updateCourse] = useUpdateCourseMutation();

  // ✅ Улучшена синхронизация: обновляем только если не в режиме перетаскивания
  useEffect(() => {
    if (!isDraggingRef.current) {
      setOrderedLessons(lessons);
    }
  }, [lessons]);

  // Настройка сенсоров для drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ✅ Добавлен обработчик начала перетаскивания
  const handleDragStart = (event: DragStartEvent) => {
    isDraggingRef.current = true;
  };

  // ✅ Добавлена защита от кликов во время перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    isDraggingRef.current = false;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedLessons((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });

    setIsReordering(true);
    setSnackbar({
      open: true,
      message:
        "Порядок уроков изменен. Нажмите «Сохранить порядок», чтобы применить изменения.",
      severity: "success",
    });
  };

  // ✅ Исправлена критическая ошибка: отправляем только нужные поля
  const handleSaveOrder = async () => {
    if (!isReordering || !courseInfo.id) return;

    setIsSavingOrder(true);

    try {
      // ✅ Формируем корректный объект для апи (только нужные поля)
      const lessonIdToPosition: { [key: string]: number } = {};
      orderedLessons.forEach((lesson, index) => {
        lessonIdToPosition[lesson.id.toString()] = index + 1;
      });

      await updateCourse({
        courseId: courseInfo.id,
        createCourseRequest: {
          title: courseInfo.title || "",
          description: courseInfo.description || undefined,
          authorFullName: courseInfo.authorFullName || undefined,
          coverFilePath: courseInfo.coverFilePath || undefined,
          deadlineDays: courseInfo.deadlineDays,
          lessonsFreeOrder: courseInfo.lessonsFreeOrder,
          sectionId: courseInfo.sectionId,
          lessonIdToPosition,
        },
      }).unwrap();

      setIsReordering(false);
      setSnackbar({
        open: true,
        message: "Порядок уроков успешно сохранен!",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Ошибка сохранения порядка уроков:", err);
      setSnackbar({
        open: true,
        message: err?.data?.message || "Ошибка при сохранении порядка уроков",
        severity: "error",
      });
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleCancelOrder = () => {
    setOrderedLessons(lessons);
    setIsReordering(false);
    setSnackbar({
      open: true,
      message: "Изменения порядка отменены",
      severity: "info",
    });
  };

  return (
    <Box
      sx={{
        minWidth: 300,
        maxWidth: 300,
        height: "calc(100vh - 165px)",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {lessons.length === 0 ? (
        <Stack mt={10} spacing={4} sx={{ px: 3 }}>
          <Typography variant="h5" textAlign="center">
            В данный курс еще не добавлены уроки
          </Typography>
          <Typography variant="body2" textAlign="center">
            Чтобы добавить - выберите нужный тип из предложенных справа
          </Typography>
        </Stack>
      ) : (
        <>
          {/* <Box sx={{ p: 2, pb: 1, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Уроки курса ({orderedLessons.length})
            </Typography>
            {isReordering && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                Перетащите уроки для изменения порядка
              </Typography>
            )}
          </Box> */}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedLessons.map((lesson) => lesson.id)}
              strategy={verticalListSortingStrategy}
            >
              <List sx={{ flex: 1, overflowY: "auto", p: 0 }}>
                {orderedLessons.map((lesson) => (
                  <SortableLessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isActive={lesson.id === activeLessonId}
                    onClick={() =>
                      !isDraggingRef.current && onLessonClick(lesson.id)
                    }
                  />
                ))}
              </List>
            </SortableContext>
          </DndContext>

          {/* Кнопка сохранения порядка */}
          {isReordering && (
            <Box sx={{ p: 2, borderRadius: 1 }}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                {/* <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelOrder}
                  disabled={isSavingOrder}
                >
                  Отменить
                </Button> */}
                <Button
                  variant="contained"
                  // startIcon={<DragIndicatorIcon />}
                  fullWidth
                  onClick={handleSaveOrder}
                  disabled={isSavingOrder}
                >
                  {isSavingOrder ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Сохранить порядок уроков"
                  )}
                </Button>
              </Stack>
            </Box>
          )}

          <Box sx={{ p: 2, pt: 1, borderTop: 1, borderColor: "divider" }}>
            <Button variant="outlined" fullWidth onClick={onCreateLessonClick}>
              Добавить урок
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

// ✅ Упрощённый компонент сортируемого элемента
const SortableLessonItem = ({
  lesson,
  isActive,
  onClick,
}: {
  lesson: LessonDto;
  isActive: boolean;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: "pointer",
    backgroundColor: isActive ? "#EBEBEB" : "inherit",
    borderRadius: 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      {...attributes}
      onClick={onClick}
      sx={{
        px: 2,
        py: 1.5,
        "&:hover": {
          bgcolor: isActive ? "#EBEBEB" : "action.hover",
        },
        ...style,
      }}
    >
      <ListItemIcon>
        <IconBorderWrapper>
          {lessonTypeToIcon[lesson.lessonType]}
        </IconBorderWrapper>
      </ListItemIcon>
      <ListItemText>
        <Typography noWrap variant="body2">
          {lesson.title}
        </Typography>
      </ListItemText>
      <IconButton {...listeners} size="small" sx={{ ml: 1, cursor: "grab" }}>
        <DragIndicatorIcon fontSize="small" color="action" />
      </IconButton>
    </ListItem>
  );
};
