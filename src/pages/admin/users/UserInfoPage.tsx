"use client";

import {
  useGetUserQuery,
  useGetUserStatsQuery,
} from "@/entities/user/model/usersApi";
import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import GroupTable from "@/features/groupsManagement/ui/GroupTable";
import UserStatsTable from "@/features/usersManagement/ui/UserStatsTable";
import { routes } from "@/shared/config/routes";
import TabNavigation from "@/shared/ui/TabNavigation";
import Box from "@mui/material/Box";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function UserInfoPage() {
  const params = useParams();
  const userId = params?.id as string;
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") as string;

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
              router.push(routes.admin.users.userByIdAndTab(userId, tabId))
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
