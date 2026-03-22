"use client";

import {
  useAddUserToGroupMutation,
  useGetGroupFullInfoByIdQuery,
  useGetUsersWithoutGroupQuery,
  useRemoveUsersFromGroupMutation,
} from "@/features/groupsManagement/api/groupsApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageGroupStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  const { currentData: groupInfo } = useGetGroupFullInfoByIdQuery(groupId);
  const { currentData: notInStudents } = useGetUsersWithoutGroupQuery(groupId);
  const [assignStudents] = useAddUserToGroupMutation();
  const [unAssignStudents] = useRemoveUsersFromGroupMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление студентами</Typography>
          <Typography variant="body2" color="secondary">
            {groupInfo?.group.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={groupInfo?.users || []}
        notIn={notInStudents || []}
        onSubmit={(listIn: number[], listNotIn: number[]) => {
          try {
            if (listIn.length)
              assignStudents({ groupId: groupId, idsRequest: { ids: listIn } });
            if (listNotIn.length)
              unAssignStudents({
                groupId: groupId,
                idsRequest: { ids: listNotIn },
              });
            if (groupInfo)
              router.push(
                routes.admin.groups.groupInfoByIdAndTab(
                  groupInfo?.group.type,
                  groupId,
                  "students"
                )
              );
          } catch (err) {
            console.log(err);
          }
        }}
        onCancel={() => {
          if (groupInfo)
            router.push(
              routes.admin.groups.groupInfoByIdAndTab(
                groupInfo.group.type,
                groupId,
                "students"
              )
            );
        }}
      />
    </Box>
  );
}
