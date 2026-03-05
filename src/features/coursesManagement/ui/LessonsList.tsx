import { LessonDto } from "@/entities/course/model/types";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import IconBorderWrapper from "@/shared/ui/IconBorderWrapper";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";

interface LessonsListProps {
  activeLessonId?: number;
  lessons: LessonDto[];
  onLessonClik: (lesson: LessonDto | undefined) => void;
}

export default function LessonsList({
  activeLessonId,
  lessons,
  onLessonClik,
}: LessonsListProps) {
  return (
    <Box
      sx={{
        minWidth: "300px",
        maxWidth: "300px",
        height: "calc(100vh - 165px)",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      {lessons.length === 0 ? (
        <Stack mt={10} spacing={4}>
          <Typography variant="h3" textAlign={"center"}>
            В данный курс еще не добавлены уроки
          </Typography>
          <Typography variant="body2" textAlign={"center"}>
            Чтобы добавить - выберите нужный тип из предложенных справа
          </Typography>
        </Stack>
      ) : (
        <>
          <List sx={{ height: "calc(100vh - 215px)", overflowY: "auto" }}>
            {lessons.map((lesson) => (
              <ListItem
                key={lesson.id}
                onClick={() => onLessonClik(lesson)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                  },
                  backgroundColor:
                    lesson.id === activeLessonId ? "#EBEBEB" : "inherit",
                  borderRadius: 2,
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
              </ListItem>
            ))}
          </List>
          <Box textAlign={"center"} mx={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => onLessonClik(undefined)}
            >
              Добавить урок
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
