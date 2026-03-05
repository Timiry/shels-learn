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
  const { currentData: courseInfo } = useGetCourseQuery(+courseId);

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
            lessons={courseInfo?.lessons || []}
          />
        )}
      </TabNavigation>
    </Box>
  );
}
