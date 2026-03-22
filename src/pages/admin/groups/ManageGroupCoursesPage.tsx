"use client";

import {
  useAssignCoursesToGroupMutation,
  useGetAvailableToAssignCoursesQuery,
  useGetGroupFullInfoByIdQuery,
  useUnassignCoursesFromGroupMutation,
} from "@/features/groupsManagement/api/groupsApi";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import ManageAnyLists from "@/shared/ui/ManageAnyLists";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function ManageGroupCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  const { currentData: groupInfo } = useGetGroupFullInfoByIdQuery(groupId);
  const { currentData: notInCourses } =
    useGetAvailableToAssignCoursesQuery(groupId);
  const [assignCourses] = useAssignCoursesToGroupMutation();
  const [unAssignCourses] = useUnassignCoursesFromGroupMutation();

  return (
    <Box>
      <HeaderBox>
        <Box>
          <Typography variant="h2">Управление курсами</Typography>
          <Typography variant="body2" color="secondary">
            {groupInfo?.group.title}
          </Typography>
        </Box>
      </HeaderBox>
      <ManageAnyLists
        in={groupInfo?.courses || []}
        notIn={notInCourses || []}
        onSubmit={(listIn: number[], listNotIn: number[]) => {
          try {
            if (listIn)
              assignCourses({ groupId: groupId, idsRequest: { ids: listIn } });
            if (listNotIn)
              unAssignCourses({
                groupId: groupId,
                idsRequest: { ids: listNotIn },
              });
            if (groupInfo)
              router.push(
                routes.admin.groups.groupInfoByIdAndTab(
                  groupInfo?.group.type,
                  groupId,
                  "courses"
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
                "courses"
              )
            );
        }}
      />
    </Box>
  );
}
