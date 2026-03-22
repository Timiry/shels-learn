import ProgramInfoPage from "@/pages/admin/programs/ProgramInfoPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function ProgramInfo() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ProgramInfoPage />
    </Suspense>
  );
}
