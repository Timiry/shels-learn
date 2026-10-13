"use client";

import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import GroupTable from "@/features/groupsManagement/ui/GroupTable";
import {
  useMyProfileQuery,
  useMyStatsQuery,
} from "@/features/student/api/studentApi";
import UserStatsTable from "@/features/usersManagement/ui/UserStatsTable";
import { routes } from "@/shared/config/routes";
import TabNavigation from "@/shared/ui/TabNavigation";
import Box from "@mui/material/Box";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const [tab, setTab] = useState("courses");
  const { currentData: userInfo } = useMyProfileQuery();
  const { currentData: userStats } = useMyStatsQuery();

  const pathname = usePathname();
  const activeRole = pathname?.includes("admin") ? "ADMIN" : "STUDENT";

  const router = useRouter();
  return (
    userInfo && (
      <Box display="flex" sx={{ height: "100vh", overflow: "hidden" }}>
        <UserInfoCard
          user={userInfo}
          onEditClick={() =>
            router.push(
              activeRole === "ADMIN"
                ? routes.admin.editProfile
                : routes.student.editProfile
            )
          }
        />
        <Box
          flexGrow={1}
          minWidth={0}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <TabNavigation
            tabs={
              userInfo.role === "ADMIN"
                ? [
                    { id: "courses", label: "Курсы" },
                    { id: "groups", label: "Группы" },
                  ]
                : [{ id: "courses", label: "Курсы" }]
            }
            activeTab={tab}
            onTabChange={(tabId: string) => setTab(tabId)}
          >
            {tab === "courses" && <UserStatsTable stats={userStats || []} />}
            {tab === "groups" && <GroupTable groups={userInfo.groups || []} />}
          </TabNavigation>
        </Box>
      </Box>
    )
  );
}
