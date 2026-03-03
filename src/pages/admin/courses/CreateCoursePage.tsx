"use client";

import { useCreateCourseMutation } from "@/entities/course/model/coursesApi";
import { CreateCourseRequest, CourseDto } from "@/entities/course/model/types";
import EditCourseForm from "@/features/coursesManagement/ui/EditCourseForm";
import { useUploadMutation } from "@/shared/api/filesApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCoursePage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const router = useRouter();
  const formId = "course-create-form";
  const [uploadImage] = useUploadMutation();
  const [createCourse] = useCreateCourseMutation();
  // мок:
  // const createCourse = (courseInfo: CreateCourseRequest): CourseDto => ({
  //   courseId: 1,
  //   title: "Основы программирования на JavaScript",
  //   discription:
  //     "Изучите основы программирования на JavaScript: синтаксис, структуры данных, объектно-ориентированное программирование и современные фреймворки.",
  //   coverUrl: "/cover.png",
  // });

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
            onSubmit={async (courseInfo: CreateCourseRequest) => {
              let course: CourseDto;
              if (photo === null) {
                course = await createCourse(courseInfo).unwrap();
              } else {
                const cover = await uploadImage({
                  file: photo,
                }).unwrap();
                course = await createCourse({
                  coverFilePath: cover.path,
                  ...courseInfo,
                }).unwrap();
              }
              router.push(routes.admin.courses.courseById(course.id));
            }}
            formId={formId}
            isCreation={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
