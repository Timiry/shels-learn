"use client";

import { CourseAdminDetailsDto } from "@/entities/course/model/coursesApi";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Link,
} from "@mui/material/";

import NextLink from "next/link";

import IconBorderWrapper from "@/shared/ui/IconBorderWrapper";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";
import { routes } from "@/shared/config/routes";

export default function CourseContent({
  courseInfo,
}: {
  courseInfo: CourseAdminDetailsDto;
}) {
  return (
    <Box mx={"28px"}>
      <Typography display={"block"} variant="body2">
        {courseInfo.course?.description}
      </Typography>
      <List sx={{ mt: "28px" }}>
        {courseInfo.lessons?.map((lesson) => (
          <Link
            component={NextLink}
            href={routes.admin.courses.editCourseLesson(
              lesson.courseId,
              lesson.id
            )}
            key={lesson.id}
          >
            <ListItem
              sx={{
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "primary.light",
                },
              }}
            >
              <ListItemIcon>
                <IconBorderWrapper>
                  {lessonTypeToIcon[lesson.lessonType]}
                </IconBorderWrapper>
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">{lesson.title}</Typography>
              </ListItemText>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
}
