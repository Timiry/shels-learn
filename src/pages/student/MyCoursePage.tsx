"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import {
  useCourseForLearnerQuery,
  useNextLessonForLearnerQuery,
} from "@/features/student/api/studentApi";
import IconBorderWrapper from "@/shared/ui/IconBorderWrapper";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";

export default function MyCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const { currentData: course } = useCourseForLearnerQuery(+courseId);
  const { currentData: nextLesson } = useNextLessonForLearnerQuery(+courseId);

  return (
    <Box width={"80%"} mx={"auto"}>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Курсы{" > "}
            {course?.title}
          </Typography>
          <Typography variant="h1">{course?.title}</Typography>
        </Box>
        <Box display={"flex"} alignItems={"center"}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              if (course?.lessons)
                router.push(
                  routes.student.lessonById(
                    courseId,
                    nextLesson ? nextLesson?.id : course.lessons[0].id
                  )
                );
            }}
          >
            Перейти к обучению
          </Button>
        </Box>
      </HeaderBox>

      <Box mx={"28px"}>
        <Typography display={"block"} variant="body2" pb={2}>
          {course?.description}
        </Typography>
        <Divider />
        <List sx={{ mt: "28px" }}>
          {course?.lessons?.map((lesson) => (
            <ListItem key={lesson.id}>
              <ListItemIcon
                sx={{
                  color: lesson.passed ? "success.dark" : "text.secondary",
                }}
              >
                {lessonTypeToIcon[lesson.lessonType]}
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">{lesson.title}</Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
