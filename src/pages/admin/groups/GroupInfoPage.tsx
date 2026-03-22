"use client";

import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import TabNavigation from "@/shared/ui/TabNavigation";
import {
  CreateGroupRequest,
  GroupType,
  useDeleteGroupMutation,
  useGetGroupFullInfoByIdQuery,
  useUpdateGroupMutation,
} from "@/features/groupsManagement/api/groupsApi";
import groupTypeToWord from "@/features/groupsManagement/lib/groupTypeToWord";
import GroupStudentsTable from "@/features/groupsManagement/ui/GroupStudentsTable";
import GroupCoursesTable from "@/features/groupsManagement/ui/GroupCoursesTable";
import GroupProgramsTable from "@/features/groupsManagement/ui/GroupProgramsTable";
import { useState } from "react";
import GroupModalForm from "@/features/groupsManagement/ui/GroupModalForm";

export default function GroupInfoPage() {
  const router = useRouter();
  const params = useParams();
  const groupType = params?.type as GroupType;
  const groupId = params?.id as string;

  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "students";

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const { currentData: groupInfo } = useGetGroupFullInfoByIdQuery(groupId);
  const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="caption" color="secondary">
            Группы{" > "}
            {groupTypeToWord[groupType]}
          </Typography>
          <Typography variant="h1">{groupInfo?.group.title}</Typography>
        </Box>
        <Tooltip arrow title={"Редактировать группу"}>
          <IconButton
            onClick={() => {
              setIsGroupModalOpen(true);
            }}
          >
            <EditOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </HeaderBox>

      {groupInfo && (
        <TabNavigation
          tabs={[
            { id: "students", label: "СТУДЕНТЫ" },
            { id: "courses", label: "Курсы" },
            { id: "programs", label: "Программы" },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId: string) =>
            router.push(
              routes.admin.groups.groupInfoByIdAndTab(
                groupInfo?.group.type,
                groupInfo.group.id,
                tabId
              )
            )
          }
        >
          {activeTab === "students" && (
            <Box px={"28px"}>
              <Box pb={2} display={"flex"} justifyContent={"end"}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    router.push(
                      routes.admin.groups.manageStudents(
                        groupInfo.group.type,
                        groupId
                      )
                    );
                  }}
                >
                  Управление студентами
                </Button>
              </Box>
              <GroupStudentsTable students={groupInfo.users || []} />
            </Box>
          )}

          {activeTab === "courses" && (
            <Box px={"28px"}>
              <Box pb={2} display={"flex"} justifyContent={"end"}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    router.push(
                      routes.admin.groups.manageCourses(
                        groupInfo.group.type,
                        groupId
                      )
                    );
                  }}
                >
                  Управление курсами
                </Button>
              </Box>
              <GroupCoursesTable courses={groupInfo.courses || []} />
            </Box>
          )}

          {activeTab === "programs" && (
            <Box px={"28px"}>
              <Box pb={2} display={"flex"} justifyContent={"end"}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    router.push(
                      routes.admin.groups.managePrograms(
                        groupInfo.group.type,
                        groupId
                      )
                    );
                  }}
                >
                  Управление программами
                </Button>
              </Box>
              <GroupProgramsTable programs={groupInfo.programs || []} />
            </Box>
          )}
        </TabNavigation>
      )}

      {groupInfo?.group && (
        <GroupModalForm
          open={isGroupModalOpen}
          onSubmit={(groupInfo: CreateGroupRequest) => {
            try {
              updateGroup({ groupId: groupId, updateGroupRequest: groupInfo });
              setIsGroupModalOpen(false);
            } catch (err) {
              console.log(err);
            }
          }}
          onDelete={(groupId: string) => {
            try {
              deleteGroup(groupId);
              setIsGroupModalOpen(false);
              router.push(routes.admin.groups.allGroupsByType(groupType));
            } catch (err) {
              console.log(err);
            }
          }}
          onClose={() => {
            setIsGroupModalOpen(false);
          }}
          isCreation={false}
          currentValues={groupInfo.group}
        />
      )}
    </Box>
  );
}
