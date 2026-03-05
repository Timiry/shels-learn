"use client";

import { useGetUserQuery } from "@/entities/user/model/usersApi";
import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import { routes } from "@/shared/config/routes";
import { useParams, useRouter } from "next/navigation";

export default function UserInfoPage() {
  const params = useParams();
  const userId = params?.id as string;

  const { currentData: userInfo } = useGetUserQuery(+userId);

  const router = useRouter();
  return (
    userInfo && (
      <UserInfoCard
        user={userInfo}
        onEditClick={() => router.push(routes.admin.users.editUserById(userId))}
      />
    )
  );
}
