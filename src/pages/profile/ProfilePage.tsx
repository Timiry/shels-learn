"use client";

import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import {
  useMyProfileQuery,
  useMyStatsQuery,
} from "@/features/student/api/studentApi";
import UserStatsTable from "@/features/usersManagement/ui/UserStatsTable";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function ProfilePage() {
  const { currentData: userInfo } = useMyProfileQuery();
  const { currentData: userStats } = useMyStatsQuery();

  const pathname = usePathname();
  const activeRole = pathname?.includes("admin") ? "ADMIN" : "STUDENT";

  const router = useRouter();
  return (
    userInfo && (
      <Box display="flex">
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
        <Box flexGrow={1}>
          <HeaderBox>
            <Typography variant="subtitle1">Обучение</Typography>
          </HeaderBox>
          <UserStatsTable stats={userStats || []} />
        </Box>
      </Box>
    )
  );
}
