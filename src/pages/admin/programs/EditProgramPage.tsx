"use client";

import {
  useDeleteProgramMutation,
  useGetProgramCourseListsQuery,
  useGetProgramQuery,
  useUpdateProgramCourseListsMutation,
  useUpdateProgramMutation,
} from "@/features/programs/model/programsApi";
import EditProgramInfo from "@/features/programs/ui/EditProgramInfo";
import ManageProgramCourses from "@/features/programs/ui/ManageProgramCourses";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import TabNavigation from "@/shared/ui/TabNavigation";
import { Box, Typography } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function EditProgramPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "info";

  const params = useParams();
  const programId = params?.id as string;
  const { currentData: programInfo } = useGetProgramQuery(+programId);
  const { currentData: courseLists } =
    useGetProgramCourseListsQuery(+programId);

  const router = useRouter();

  const [updateProgram] = useUpdateProgramMutation();
  const [deleteProgram] = useDeleteProgramMutation();
  const [updateProgramCourseList] = useUpdateProgramCourseListsMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Редактор программы</Typography>
          <Typography variant="body2" color="secondary">
            {programInfo?.title}
          </Typography>
        </Box>
      </HeaderBox>

      <TabNavigation
        tabs={[
          { id: "info", label: "ИНФОРМАЦИЯ" },
          { id: "courses", label: "КУРСЫ" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId: string) => {
          router.push(
            routes.admin.programs.editProgramByIdAndTab(programId, tabId)
          );
        }}
      >
        {activeTab === "info" && (
          <Box>
            {programInfo !== undefined && (
              <EditProgramInfo
                programInfo={programInfo}
                onUpdate={updateProgram}
                onDelete={deleteProgram}
              />
            )}
          </Box>
        )}
        {activeTab === "courses" && (
          <ManageProgramCourses
            in={courseLists?.in || []}
            notIn={courseLists?.notIn || []}
            onSubmit={(orderCourseIds: number[]) => {
              updateProgramCourseList({
                programId: +programId,
                programCourseAssignRequest: {
                  orderedCourseIds: orderCourseIds,
                },
              });
            }}
            onCancel={() =>
              router.push(
                routes.admin.programs.programInfoByIdAndTab(
                  programId,
                  "description"
                )
              )
            }
          />
        )}
      </TabNavigation>
    </Box>
  );
}
