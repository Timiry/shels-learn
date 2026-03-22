import GroupInfoPage from "@/pages/admin/groups/GroupInfoPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function GroupInfo() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <GroupInfoPage />
    </Suspense>
  );
}
