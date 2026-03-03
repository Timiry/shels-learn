"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter, useParams } from "next/navigation";
import TabNavigation from "@/shared/ui/TabNavigation";
import { useState } from "react";
import { useGetCourseQuery } from "@/entities/course/model/coursesApi";
import { CourseAdminDetailsDto } from "@/entities/course/model/types";
import CourseContent from "@/features/coursesManagement/ui/CourseContent";

export default function CourseInfoPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;
  // const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  // мок:
  const courseInfo: CourseAdminDetailsDto = {
    course: {
      id: 1,
      title: "Основы программирования на JavaScript",
      description:
        "Изучите основы программирования на JavaScript: синтаксис, структуры данных, объектно-ориентированное программирование и современные фреймворки.",
      coverFilePath: "/cover.png",
    },
    lessons: [
      {
        title: "Текст",
        id: 0,
        courseId: 0,
        position: 0,
        lessonType: "THEORY_TEXT",
      },
      {
        title: "PDF",
        id: 1,
        courseId: 0,
        position: 1,
        lessonType: "THEORY_PDF",
      },
      {
        title: "Видео",
        id: 2,
        courseId: 0,
        position: 2,
        lessonType: "THEORY_VIDEO",
      },
      {
        title: "Тест",
        id: 3,
        courseId: 0,
        position: 3,
        lessonType: "PRACTICE_TEST",
      },
      {
        title: "Задание",
        id: 4,
        courseId: 0,
        position: 4,
        lessonType: "PRACTICE_OPEN_ANSWER",
      },
    ],
  };
  const [activeTab, setActiveTab] = useState("description");

  return (
    <Box width={"80%"} mx={"auto"}>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Курсы{" > "}
            {courseInfo.course.title}
          </Typography>
          <Typography variant="h1">{courseInfo.course.title}</Typography>
        </Box>
        <Tooltip arrow title={"Редактировать курс"}>
          <IconButton
            onClick={() => {
              router.push(routes.admin.courses.editCourseById(courseId));
            }}
          >
            <EditOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </HeaderBox>
      <TabNavigation
        tabs={[
          { id: "description", label: "ОПИСАНИЕ" },
          { id: "reviewers", label: "ТРЕНЕРЫ" },
          { id: "students", label: "СТУДЕНТЫ" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === "description" && (
          <CourseContent courseInfo={courseInfo} />
        )}
        {activeTab === "reviewers" && <Box></Box>}
        {activeTab === "students" && <Box></Box>}
      </TabNavigation>
    </Box>
  );
}
