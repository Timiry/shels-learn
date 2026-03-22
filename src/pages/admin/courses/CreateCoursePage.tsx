"use client";

import { useCreateCourseMutation } from "@/entities/course/model/coursesApi";
import {
  CreateCourseRequest,
  CourseDto,
} from "@/entities/course/model/coursesApi";
import { useGetAllSectionsQuery } from "@/entities/section/model/sectionsApi";
import EditCourseForm from "@/features/coursesManagement/ui/EditCourseForm";
import { useUploadMutation } from "@/shared/api/filesApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ImageUpload from "@/shared/ui/ImageUpload";
import { Box, Typography, Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CreateCoursePage() {
  const searchParams = useSearchParams();
  const sectionIdForCreation = searchParams?.get("sectionId");
  const [photo, setPhoto] = useState<File | null>(null);
  const router = useRouter();
  const formId = "course-create-form";
  const { currentData: sections } = useGetAllSectionsQuery();
  const [uploadImage] = useUploadMutation();
  const [createCourse] = useCreateCourseMutation();

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
                  ...courseInfo,
                  coverFilePath: cover.link,
                }).unwrap();
              }
              router.push(
                routes.admin.courses.courseInfoByIdAndTab(
                  course.id,
                  "description"
                )
              );
            }}
            sections={sections}
            sectionIdForCreation={
              sectionIdForCreation ? +sectionIdForCreation : undefined
            }
            formId={formId}
            isCreation={true}
          />
        </Box>
      </Box>
    </Box>
  );
}
