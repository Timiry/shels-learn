"use client";

import {
  useDeleteCourseMutation,
  useGetCourseQuery,
  useUpdateCourseMutation,
} from "@/entities/course/model/coursesApi";
import { CourseAdminDetailsDto } from "@/entities/course/model/coursesApi";
import { useGetAllSectionsQuery } from "@/entities/section/model/sectionsApi";
import EditCourseInfo from "@/features/coursesManagement/ui/EditCourseInfo";
import EditCourseLessons from "@/features/coursesManagement/ui/EditCourseLessons";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import TabNavigation from "@/shared/ui/TabNavigation";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function EditCoursePage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "info";
  const lessonId = searchParams?.get("lessonId");
  const mode = searchParams?.get("mode");
  const lessonType = searchParams?.get("type");

  const params = useParams();
  const courseId = params?.id as string;
  const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  const { currentData: sections } = useGetAllSectionsQuery();

  const router = useRouter();

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
        onTabChange={(tabId: string) => {
          router.push(
            routes.admin.courses.editCourseByIdAndTab(courseId, tabId)
          );
        }}
      >
        {activeTab === "info" && (
          <Box>
            {courseInfo !== undefined && courseInfo.course !== undefined && (
              <EditCourseInfo
                courseInfo={courseInfo.course}
                sections={sections}
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
            activeLessonId={lessonId}
            mode={mode}
            lessonType={lessonType}
          />
        )}
      </TabNavigation>
    </Box>
  );
}
