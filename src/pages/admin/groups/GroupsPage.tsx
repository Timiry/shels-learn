"use client";

import {
  CreateGroupRequest,
  GroupDto,
  GroupType,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGroupsQuery,
} from "@/features/groupsManagement/api/groupsApi";
import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useParams, useRouter } from "next/navigation";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import TabNavigation from "@/shared/ui/TabNavigation";
import { routes } from "@/shared/config/routes";
import groupTypeToWord from "@/features/groupsManagement/lib/groupTypeToWord";
import GroupTable from "@/features/groupsManagement/ui/GroupTable";
import GroupModalForm from "@/features/groupsManagement/ui/GroupModalForm";
import { useState } from "react";

export default function GroupsPage() {
  const router = useRouter();
  const params = useParams();
  const groupType = params?.type as GroupType;

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const { currentData: allGroups } = useGroupsQuery();
  const [createGroup] = useCreateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  const groupsByType: GroupDto[] =
    allGroups?.filter((item) => item.type === groupType) || [];

  return (
    <Box>
      <TabNavigation
        tabs={[
          { id: "GENERAL", label: "Общие" },
          { id: "COMPANY", label: "Компании" },
          { id: "DEPARTMENT", label: "Подразделения" },
          { id: "POSITION", label: "Должности" },
        ]}
        activeTab={groupType}
        onTabChange={(tabId: string) =>
          router.push(routes.admin.groups.allGroupsByType(tabId))
        }
      >
        <HeaderBox>
          <Box>
            <Typography variant="h1">{groupTypeToWord[groupType]}</Typography>
          </Box>
          <Tooltip arrow title={"Создать группу"}>
            <IconButton onClick={() => setIsGroupModalOpen(true)}>
              <AddOutlinedIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </HeaderBox>

        <Box px={"28px"}>
          <GroupTable groups={groupsByType} />
        </Box>
      </TabNavigation>
      <GroupModalForm
        open={isGroupModalOpen}
        onSubmit={(groupInfo: CreateGroupRequest) => {
          try {
            createGroup(groupInfo);
            setIsGroupModalOpen(false);
          } catch (err) {
            console.log(err);
          }
        }}
        onDelete={(groupId: string) => {
          try {
            deleteGroup(groupId);
            setIsGroupModalOpen(false);
          } catch (err) {
            console.log(err);
          }
        }}
        onClose={() => {
          setIsGroupModalOpen(false);
        }}
        isCreation={true}
        currentValues={{ id: "", title: "", type: groupType }}
      />
    </Box>
  );
}
