"use client";

import {
  useAssignStudentsMutation,
  useGetCourseQuery,
  useGetEnrollmentListsQuery,
} from "@/entities/course/model/coursesApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageLists from "@/shared/ui/ManageLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageCourseStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  const { currentData: studentsLists } = useGetEnrollmentListsQuery(+courseId);
  const [asignStudents] = useAssignStudentsMutation();

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
      <ManageLists
        in={studentsLists?.in || []}
        notIn={studentsLists?.notIn || []}
        onSubmit={(lists: {
          idsToEnroll?: number[];
          idsToUnenroll?: number[];
        }) => {
          asignStudents({
            courseId: +courseId,
            userInNotInRequest: {
              idsIn: lists.idsToEnroll,
              idsNotIn: lists.idsToUnenroll,
            },
          });
          router.push(routes.admin.courses.courseById(courseId));
        }}
        onCancel={() => router.push(routes.admin.courses.courseById(courseId))}
      />
    </Box>
  );
}
