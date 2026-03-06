"use client";

import {
  StudentCourseStatDto,
  useGetUserQuery,
  useGetUserStatsQuery,
} from "@/entities/user/model/usersApi";
import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import UserStatsTable from "@/features/usersManagement/ui/UserStatsTable";
import { routes } from "@/shared/config/routes";
import HeaderBox from "@/shared/ui/HeaderBox";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";

export default function UserInfoPage() {
  const params = useParams();
  const userId = params?.id as string;

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
          <HeaderBox>
            <Typography variant="subtitle1">Обучение</Typography>
          </HeaderBox>
          <UserStatsTable stats={userStats || []} />
        </Box>
      </Box>
    )
  );
}
