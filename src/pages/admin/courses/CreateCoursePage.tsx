"use client";

import { CourseCreateEditInfo, CourseDto } from "@/entities/course/model/types";
import EditCourseForm from "@/features/coursesManagement/ui/EditCourseForm";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCoursePage() {
  const [photo, setPhoto] = useState<File | null>();
  const router = useRouter();
  const formId = "course-create-form";
  // const [createCourse] = useCreateCourseMutation();
  // мок:
  const createCourse = (courseInfo: CourseCreateEditInfo): CourseDto => ({
    courseId: 1,
    title: "Основы программирования на JavaScript",
    discription:
      "Изучите основы программирования на JavaScript: синтаксис, структуры данных, объектно-ориентированное программирование и современные фреймворки.",
    coverUrl: "/cover.png",
  });

  return (
    <Box>
      <HeaderBox>
        <Typography variant="h1" display={"inline"}>
          Создание Курса
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
            value={photo}
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
              const course = createCourse(courseInfo);
              router.push(routes.admin.courses.courseById(course.courseId));
            }}
            formId={formId}
            isCreation={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
