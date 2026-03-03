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
  // const { currentData: courses } = useGetAllCoursesQuery();
  // мок:
  const courses: CourseSummaryDto[] = [
    {
      id: 1,
      title: "Основы программирования на JavaScript",
      description:
        "Изучите основы программирования на JavaScript: синтаксис, структуры данных, объектно-ориентированное программирование и современные фреймворки.",
      coverFilePath: "/cover.png",
      theoryLessonsCount: 1,
      practiceLessonsCount: 2,
    },
    {
      id: 2,
      title: "Проектирование пользовательских интерфейсов",
      description:
        "Освойте принципы создания удобных и эстетичных пользовательских интерфейсов.",
      coverFilePath: "/cover.png",
      theoryLessonsCount: 1,
      practiceLessonsCount: 2,
    },
    {
      id: 3,
      title: "Управление проектами по методологии Agile",
      description:
        "Изучите методологию Agile и её применение в управлении проектами. Освойте техники планирования, оценки и контроля проектов. Изучите методологию Agile и её применение в управлении проектами. Освойте техники планирования, оценки и контроля проектов.",
      coverFilePath: "/cover.png",
      theoryLessonsCount: 1,
      practiceLessonsCount: 2,
    },
    {
      id: 4,
      title: "Машинное обучение для начинающих",
      description:
        "Основы машинного обучения: алгоритмы, модели, инструменты и практика. Изучите, как создавать и обучать модели машинного обучения.",
      coverFilePath: "/cover.png",
      theoryLessonsCount: 1,
      practiceLessonsCount: 2,
    },
    {
      id: 5,
      title: "Цифровой маркетинг: от теории к практике",
      description:
        "Изучите современные методы цифрового маркетинга: SEO, контекстная реклама, социальные сети, email-маркетинг и анализ данных.",
      coverFilePath: "/cover.png",
      theoryLessonsCount: 1,
      practiceLessonsCount: 2,
    },
    {
      id: 6,
      title: "Финансовая грамотность для начинающих",
      description:
        "Освойте основы личных финансов: бюджетирование, инвестирование, кредиты, сбережения и планирование финансового будущего.",
      coverFilePath: "/cover.png",
      theoryLessonsCount: 1,
      practiceLessonsCount: 2,
    },
  ];

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
