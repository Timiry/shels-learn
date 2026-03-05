"use client";

import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";

import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";
import { CourseSummaryDto } from "@/entities/course/model/types";
import CourseInfoCard from "@/entities/course/ui/CourseInfoCard";
import { Stack } from "@mui/material";
import { useGetAllCoursesQuery } from "@/entities/course/model/coursesApi";

export default function CoursesPage() {
  const router = useRouter();
  const { currentData: courses } = useGetAllCoursesQuery();

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Курсы
        </Typography>
        <Tooltip arrow title={"Создать курс"}>
          <IconButton
            onClick={() => {
              router.push(routes.admin.courses.createCourse);
            }}
          >
            <BookmarkAddOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
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
        {courses?.map((course) => (
          <CourseInfoCard courseInfo={course} key={course.id} />
        ))}
      </Box>
    </Box>
  );
}
