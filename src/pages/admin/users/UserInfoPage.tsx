"use client";

import {
  StudentCourseStatDto,
  useGetUserQuery,
  useGetUserStatsQuery,
} from "@/entities/user/model/usersApi";
import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import GroupProgramsTable from "@/features/groupsManagement/ui/GroupProgramsTable";
import GroupTable from "@/features/groupsManagement/ui/GroupTable";
import UserStatsTable from "@/features/usersManagement/ui/UserStatsTable";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import TabNavigation from "@/shared/ui/TabNavigation";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function UserInfoPage() {
  const params = useParams();
  const userId = params?.id as string;
  const tab = params?.tab as string;

  const { currentData: userInfo } = useGetUserQuery(+userId);
  const { currentData: userStats } = useGetUserStatsQuery(+userId);

  const router = useRouter();
  return (
    userInfo && (
      <Box display="flex">
        <UserInfoCard
          user={userInfo}
          onEditClick={() =>
            router.push(routes.admin.users.editUserById(userId))
          }
        />
        <Box flexGrow={1}>
          <TabNavigation
            tabs={[
              { id: "courses", label: "Курсы" },
              // { id: "programs", label: "Программы" }, //TODO: добавить вкладку группы с личной стат по прграммам
              { id: "groups", label: "Группы" },
            ]}
            activeTab={tab}
            onTabChange={(tabId: string) =>
              router.push(routes.admin.groups.allGroupsByType(tabId))
            }
          >
            {tab === "courses" && <UserStatsTable stats={userStats || []} />}
            {/* {tab === "programs" && <GroupProgramsTable />} */}
            {tab === "groups" && <GroupTable groups={userInfo.groups || []} />}
          </TabNavigation>
        </Box>
      </Box>
    )
  );
}
