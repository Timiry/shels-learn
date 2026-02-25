"use client";

import { CourseCreateEditInfo, CourseDto } from "@/entities/course/model/types";
import EditCourseForm from "@/features/coursesManagement/ui/EditCourseForm";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params?.id as string;
  // const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  // мок:
  const courseInfo = {
    courseId: 1,
    title: "Основы программирования на JavaScript",
    discription:
      "Изучите основы программирования на JavaScript: синтаксис, структуры данных, объектно-ориентированное программирование и современные фреймворки.",
    coverUrl: "/cover.png",
  };
  const [photo, setPhoto] = useState<File | null>(null); //добавить фото из courseInfo
  const router = useRouter();
  const formId = "course-update-form";
  // const [updateCourse] = useUpdateCourseMutation();
  // const [deleteCourse] = useDeleteCourseMutation();
  // моки:
  const updateCourse = (
    courseId: number,
    courseInfo: CourseCreateEditInfo
  ) => ({});
  const deleteCourse = (courseId: number) => {};

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Редактор курса
        </Typography>
        <Button variant="contained" size="large" type="submit" form={formId}>
          Создать
        </Button>
      </HeaderBox>
      <Box m={"28px"} display={"flex"}>
        <Box>
          <Typography variant="body1" mb={2}>
            Обложка
          </Typography>
          <ImageUpload
            value={photo === null ? courseInfo.coverUrl : photo}
            onChange={setPhoto}
            width="300px"
            height="300px"
            isCover={true}
          />
        </Box>
        <Box pl={"50px"} flex={1}>
          <EditCourseForm
            onSubmit={(courseInfo: CourseCreateEditInfo) => {
              //TODO: добавление фото
              updateCourse(+courseId, courseInfo);
              router.push(routes.admin.courses.courseById(courseId));
            }}
            formId={formId}
            isCreation={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
