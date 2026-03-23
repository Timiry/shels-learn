"use client";

import {
  useAssignStudentMutation,
  useGetCourseQuery,
  useGetEnrollmentListsQuery,
} from "@/entities/course/model/coursesApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageCourseStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  const { currentData: studentsLists } = useGetEnrollmentListsQuery(+courseId);
  const [asignStudents] = useAssignStudentMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление студентами</Typography>
          <Typography variant="body2" color="secondary">
            {courseInfo?.course?.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={studentsLists?.in || []}
        notIn={studentsLists?.notIn || []}
        onSubmit={(idsToEnroll?: number[], idsToUnenroll?: number[]) => {
          asignStudents({
            courseId: +courseId,
            userInNotInRequest: {
              idsIn: idsToEnroll,
              idsNotIn: idsToUnenroll,
            },
          });
          router.push(
            routes.admin.courses.courseInfoByIdAndTab(courseId, "students")
          );
        }}
        onCancel={() =>
          router.push(
            routes.admin.courses.courseInfoByIdAndTab(courseId, "students")
          )
        }
      />
    </Box>
  );
}
