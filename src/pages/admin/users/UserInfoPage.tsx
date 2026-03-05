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
  // const { currentData: userStats } = useGetUserStatsQuery(+userId);
  const userStats: StudentCourseStatDto[] = [
    {
      courseId: 1,
      courseTitle: "Основы программирования на JavaScript",
      earnedPoints: 85,
      maxPoints: 100,
      efficiencyPercent: 92,
      progressPercent: 100,
      completedLessons: 15,
      totalLessons: 15,
      enrolledAt: "2026-01-15T09:00:00.000Z",
      startedAt: "2026-01-16T10:30:00.000Z",
      completedAt: "2026-02-28T18:45:00.000Z",
    },
    {
      courseId: 2,
      courseTitle: "Проектирование пользовательских интерфейсов",
      earnedPoints: 42,
      maxPoints: 60,
      efficiencyPercent: 78,
      progressPercent: 70,
      completedLessons: 14,
      totalLessons: 20,
      enrolledAt: "2026-02-01T09:00:00.000Z",
      startedAt: "2026-02-02T11:20:00.000Z",
      completedAt: undefined,
    },
    {
      courseId: 3,
      courseTitle: "Управление проектами по методологии Agile",
      earnedPoints: 15,
      maxPoints: 50,
      efficiencyPercent: 65,
      progressPercent: 30,
      completedLessons: 6,
      totalLessons: 20,
      enrolledAt: "2026-02-15T09:00:00.000Z",
      startedAt: "2026-02-16T14:00:00.000Z",
      completedAt: undefined,
    },
    {
      courseId: 4,
      courseTitle: "Машинное обучение для начинающих",
      earnedPoints: 0,
      maxPoints: 80,
      efficiencyPercent: 0,
      progressPercent: 0,
      completedLessons: 0,
      totalLessons: 16,
      enrolledAt: "2026-03-01T09:00:00.000Z",
      startedAt: undefined,
      completedAt: undefined,
    },
  ];

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
