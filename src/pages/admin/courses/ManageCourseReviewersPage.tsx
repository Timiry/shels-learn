"use client";

import {
  useAssignReviewerMutation,
  useGetCourseQuery,
  useGetCourseReviewersQuery,
} from "@/entities/course/model/coursesApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageCourseReviewersPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  const { currentData: reviewersLists } = useGetCourseReviewersQuery(+courseId);
  const [asignReviewers] = useAssignReviewerMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление тренерами</Typography>
          <Typography variant="body2" color="secondary">
            {courseInfo?.course?.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={reviewersLists?.in || []}
        notIn={reviewersLists?.notIn || []}
        onSubmit={(idsToEnroll: number[], idsToUnenroll: number[]) => {
          asignReviewers({
            courseId: +courseId,
            userInNotInRequest: {
              idsIn: idsToEnroll,
              idsNotIn: idsToUnenroll,
            },
          });
          router.push(
            routes.admin.courses.courseInfoByIdAndTab(courseId, "reviewers")
          );
        }}
        onCancel={() =>
          router.push(
            routes.admin.courses.courseInfoByIdAndTab(courseId, "reviewers")
          )
        }
      />
    </Box>
  );
}
