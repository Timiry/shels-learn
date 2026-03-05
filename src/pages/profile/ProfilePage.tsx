"use client";

import { useGetUserQuery } from "@/entities/user/model/usersApi";
import UserInfoCard from "@/entities/user/ui/UserInfoCard";
import { useMyProfileQuery } from "@/features/student/api/studentApi";
import { routes } from "@/shared/config/routes";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function ProfilePage() {
  const { currentData: userInfo } = useMyProfileQuery();

  const pathname = usePathname();
  const activeRole = pathname?.includes("admin") ? "ADMIN" : "STUDENT";

  const router = useRouter();
  return (
    userInfo && (
      <UserInfoCard
        user={userInfo.user}
        onEditClick={() =>
          router.push(
            activeRole === "ADMIN"
              ? routes.admin.editProfile
              : routes.student.editProfile
          )
        }
      />
    )
  );
}
