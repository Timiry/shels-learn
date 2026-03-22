"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import { ProgramDto } from "../model/programsApi";
import { CourseDto } from "@/entities/course/model/coursesApi";

export default function ProgramContent({
  programInfo,
  courseList,
}: {
  programInfo: ProgramDto;
  courseList?: CourseDto[];
}) {
  const courses =
    programInfo.courses
      ?.map((course) => courseList?.find((c) => c.id === course.courseId))
      .filter((course): course is CourseDto => course !== undefined) || [];

  return (
    <Box mx={"28px"}>
      <Typography display={"block"} variant="body2">
        {programInfo.description}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          py: 3,
        }}
      >
        {courses &&
          courses?.map((course, index) => (
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
      </Box>
    </Box>
  );
}
