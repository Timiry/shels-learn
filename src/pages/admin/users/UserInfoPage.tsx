"use client";

import { UserDto } from "@/entities/user/model/types";
import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import { routes } from "@/shared/config/routes";
import { useParams, useRouter } from "next/navigation";

export default function UserInfoPage() {
  const params = useParams();
  const userId = params?.id as string;

  // const { currentData: userInfo } = useGetUserQuery(+userId);
  // мок:
  const userInfo: UserDto = {
    id: 1,
    fullName: "Иванов Иван Иванович",
    email: "ivanov@example.com",
    role: "ADMIN",
    enabled: true,
    phone: "+7 (999) 123-45-67",
    comment: "eeeeee",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "Петров Петр Петрович",
    lastVisit: "2024-02-17T14:25:33Z",
    deactivatedAt: undefined,
    deactivatedBy: undefined,
  };

  const router = useRouter();
  return (
    <UserInfoCard
      user={userInfo}
      onEditClick={() => router.push(routes.admin.users.editUserById(userId))}
    />
  );
}
