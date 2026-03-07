import SetPasswordPage from "@/pages/auth/SetPasswordPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function SetPassword() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <SetPasswordPage />
    </Suspense>
  );
}
