"use client";

import { CourseAdminDetailsDto } from "@/entities/course/model/types";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import IconBorderWrapper from "@/shared/ui/IconBorderWrapper";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";

export default function CourseContent({
  courseInfo,
}: {
  courseInfo: CourseAdminDetailsDto;
}) {
  return (
    <Box mx={"28px"}>
      <Typography display={"block"} variant="body2">
        {courseInfo.course.description}
      </Typography>
      <List sx={{ mt: "28px" }}>
        {courseInfo.lessons?.map((lesson) => (
          <ListItem key={lesson.id}>
            <ListItemIcon>
              <IconBorderWrapper>
                {lessonTypeToIcon[lesson.lessonType]}
              </IconBorderWrapper>
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">{lesson.title}</Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
