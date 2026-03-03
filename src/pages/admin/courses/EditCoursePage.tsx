"use client";

import {
  useDeleteCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
} from "@/entities/course/model/coursesApi";
import { CourseAdminDetailsDto } from "@/entities/course/model/types";
import EditCourseInfo from "@/features/coursesManagement/ui/EditCourseInfo";
import EditCourseLessons from "@/features/coursesManagement/ui/EditCourseLessons";
import HeaderBox from "@/shared/ui/HeaderBox";
import TabNavigation from "@/shared/ui/TabNavigation";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function EditCoursePage() {
  const [activeTab, setActiveTab] = useState("info");

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
      {
        title: "Видео",
        id: 5,
        courseId: 0,
        position: 5,
        lessonType: "THEORY_VIDEO",
      },
      {
        title: "Тест",
        id: 6,
        courseId: 0,
        position: 6,
        lessonType: "PRACTICE_TEST",
      },
      {
        title: "Задание",
        id: 7,
        courseId: 0,
        position: 7,
        lessonType: "PRACTICE_OPEN_ANSWER",
      },
      {
        title: "Тест",
        id: 8,
        courseId: 0,
        position: 8,
        lessonType: "PRACTICE_TEST",
      },
      {
        title: "Задание",
        id: 9,
        courseId: 0,
        position: 9,
        lessonType: "PRACTICE_OPEN_ANSWER",
      },
    ],
  };

  const [updateCourse] = useUpdateCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Редактор курса</Typography>
          <Typography variant="body2" color="secondary">
            {courseInfo?.course?.title}
          </Typography>
        </Box>
      </HeaderBox>

      <TabNavigation
        tabs={[
          { id: "info", label: "ИНФОРМАЦИЯ" },
          { id: "lessons", label: "УРОКИ" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === "info" && (
          <Box>
            {courseInfo !== undefined && (
              <EditCourseInfo
                courseInfo={courseInfo.course}
                onUpdate={updateCourse}
                onDelete={deleteCourse}
              />
            )}
          </Box>
        )}
        {activeTab === "lessons" && (
          <EditCourseLessons
            courseId={+courseId}
            lessons={courseInfo.lessons || []}
          />
        )}
      </TabNavigation>
    </Box>
  );
}
