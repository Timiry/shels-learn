import UserInfoPage from "@/pages/admin/users/UserInfoPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function UserInfo() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <UserInfoPage />
    </Suspense>
  );
}
