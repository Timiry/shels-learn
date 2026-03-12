"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import TabNavigation from "@/shared/ui/TabNavigation";
import {
  useGetCourseQuery,
  useGetCourseReviewersQuery,
} from "@/entities/course/model/coursesApi";
import { CourseAdminDetailsDto } from "@/entities/course/model/types";
import CourseContent from "@/features/coursesManagement/ui/CourseContent";
import CourseStatsTable from "@/features/coursesManagement/ui/CourseStatsTable";
import { useCourseStatsQuery } from "@/features/statisticsAndReports/api/statisticsAndReportsApi";

export default function CourseInfoPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "description";

  const { currentData: courseInfo } = useGetCourseQuery(+courseId);
  const { currentData: courseReviewers } =
    useGetCourseReviewersQuery(+courseId);
  const { currentData: courseStats } = useCourseStatsQuery(+courseId);

  return (
    <Box width={"80%"} mx={"auto"}>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Курсы{" > "}
            {courseInfo?.course.title}
          </Typography>
          <Typography variant="h1">{courseInfo?.course.title}</Typography>
        </Box>
        <Tooltip arrow title={"Редактировать курс"}>
          <IconButton
            onClick={() => {
              router.push(
                routes.admin.courses.editCourseByIdAndTab(courseId, "info")
              );
            }}
          >
            <EditOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </HeaderBox>
      <TabNavigation
        tabs={[
          { id: "description", label: "ОПИСАНИЕ" },
          { id: "reviewers", label: "ТРЕНЕРЫ" },
          { id: "students", label: "СТУДЕНТЫ" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId: string) =>
          router.push(
            routes.admin.courses.courseInfoByIdAndTab(courseId, tabId)
          )
        }
      >
        {activeTab === "description" && courseInfo && (
          <CourseContent courseInfo={courseInfo} />
        )}
        {activeTab === "reviewers" && (
          <Box>
            <Box pb={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="outlined"
                onClick={() =>
                  router.push(routes.admin.courses.manageReviewers(courseId))
                }
              >
                Управление тренерами
              </Button>
            </Box>
            {courseReviewers?.in?.length ? (
              <Stack spacing={3}>
                <List sx={{ p: 0 }}>
                  {courseReviewers.in.map((user) => (
                    <ListItem
                      key={user.id}
                      sx={{
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <ListItemText
                        primary={user.fullName}
                        secondary={user.email}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            ) : (
              <Box display={"flex"} justifyContent={"center"} mt={5}>
                <Typography variant="subtitle1">
                  Тренеры не назначены
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {activeTab === "students" && (
          <Box>
            <Box pb={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="outlined"
                onClick={() =>
                  router.push(routes.admin.courses.manageStudents(courseId))
                }
              >
                Управление студентами
              </Button>
            </Box>
            <CourseStatsTable stats={courseStats || []} />
          </Box>
        )}
      </TabNavigation>
    </Box>
  );
}
