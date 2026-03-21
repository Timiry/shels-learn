"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ProgramDto } from "../model/programsApi";
import { CourseDto } from "@/entities/course/model/types";

export default function ProgramContent({
  programInfo,
  courseList,
}: {
  programInfo: ProgramDto;
  courseList?: CourseDto[];
}) {
  const courses = programInfo.courses;
  const newCourses = courses
    ?.sort((a, b) => a.orderIndex - b.orderIndex)
    .map((course) => courseList?.find((c) => c.id === course.courseId));

  return (
    <Box mx={"28px"}>
      <Typography display={"block"} variant="body2">
        {programInfo.description}
      </Typography>
      <List sx={{ mt: "28px" }}>
        {newCourses?.map((course, index) => (
          <Card sx={{ maxWidth: 270 }} key={course?.id}>
            <CardMedia
              component="img"
              height="140"
              image={
                course?.coverFilePath
                  ? "http://217.26.31.189" + course.coverFilePath
                  : "/coverFiller.png"
              }
              alt={course?.title}
            />
            <CardContent>
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {course?.title}
              </Typography>

              <Divider sx={{ my: "16px" }} />
              <Typography variant="h5" color="secondary">
                {index + 1}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
}
