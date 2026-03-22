"use client";

import {
  useGetGroupFullInfoByIdQuery,
  useGetAvailableToAssignProgramsQuery,
  useAssignProgramsToGroupMutation,
  useUnassignProgramsFromGroupMutation,
} from "@/features/groupsManagement/api/groupsApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageGroupProgramsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  const { currentData: groupInfo } = useGetGroupFullInfoByIdQuery(groupId);
  const { currentData: notInPrograms } =
    useGetAvailableToAssignProgramsQuery(groupId);
  const [assignPrograms] = useAssignProgramsToGroupMutation();
  const [unAssignPrograms] = useUnassignProgramsFromGroupMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление программами</Typography>
          <Typography variant="body2" color="secondary">
            {groupInfo?.group.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={groupInfo?.programs || []}
        notIn={notInPrograms || []}
        onSubmit={(listIn: number[], listNotIn: number[]) => {
          try {
            if (listIn)
              assignPrograms({ groupId: groupId, idsRequest: { ids: listIn } });
            if (listNotIn)
              unAssignPrograms({
                groupId: groupId,
                idsRequest: { ids: listNotIn },
              });
            if (groupInfo)
              router.push(
                routes.admin.groups.groupInfoByIdAndTab(
                  groupInfo?.group.type,
                  groupId,
                  "programs"
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
                groupInfo?.group.type,
                groupId,
                "programs"
              )
            );
        }}
      />
    </Box>
  );
}
