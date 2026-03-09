"use client";

import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useRouter } from "next/navigation";
import CourseInfoCard from "@/entities/course/ui/CourseInfoCard";
import { useMyCoursesQuery } from "@/features/student/api/studentApi";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { routes } from "@/shared/config/routes";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

export default function LearningPage() {
  const router = useRouter();
  const { currentData: courses } = useMyCoursesQuery();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1">Мои курсы</Typography>
      </HeaderBox>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
          p: 2,
        }}
      >
        {courses &&
          courses.map((course) => (
            <Card sx={{ maxWidth: 270 }} key={course.id}>
              <CardActionArea
                onClick={() =>
                  router.push(routes.student.courseById(course.id))
                }
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    course.coverFilePath
                      ? process.env.NEXT_PUBLIC_API_URL + course.coverFilePath
                      : "/coverFiller.png"
                  }
                  alt={course.title}
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
                    {course.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {course.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </Box>
    </Box>
  );
}
