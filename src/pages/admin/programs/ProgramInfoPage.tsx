"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import TabNavigation from "@/shared/ui/TabNavigation";
import {
  useGetProgramCourseListsQuery,
  useGetProgramEnrollmentListsQuery,
  useGetProgramQuery,
} from "@/features/programs/model/programsApi";
import ProgramContent from "@/features/programs/ui/ProgramContent";
import ProgramStatsTable from "@/features/programs/ui/ProgramStatsTable";

export default function ProgramInfoPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id as string;

  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "description";

  const { currentData: programInfo } = useGetProgramQuery(+programId);
  // const { currentData: programStats } = useProgramStatsQuery(+programId);
  const { currentData: courseLists } =
    useGetProgramCourseListsQuery(+programId);
  const { currentData: studentsLists } =
    useGetProgramEnrollmentListsQuery(+programId);

  return (
    <Box width={"80%"} mx={"auto"}>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Программы{" > "}
            {programInfo?.title}
          </Typography>
          <Typography variant="h1">{programInfo?.title}</Typography>
        </Box>
        <Tooltip arrow title={"Редактировать программу"}>
          <IconButton
            onClick={() => {
              router.push(
                routes.admin.programs.editProgramByIdAndTab(programId, "info")
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
          { id: "students", label: "СТУДЕНТЫ" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId: string) =>
          router.push(
            routes.admin.programs.programInfoByIdAndTab(programId, tabId)
          )
        }
      >
        {activeTab === "description" && programInfo && (
          <ProgramContent
            programInfo={programInfo}
            courseList={courseLists?.in}
          />
        )}
        {activeTab === "students" && (
          <Box>
            <Box pb={2} display={"flex"} justifyContent={"end"}>
              <Button
                variant="outlined"
                onClick={() =>
                  router.push(routes.admin.programs.manageStudents(programId))
                }
              >
                Управление студентами
              </Button>
            </Box>
            <ProgramStatsTable students={studentsLists?.in || []} />
          </Box>
        )}
      </TabNavigation>
    </Box>
  );
}
