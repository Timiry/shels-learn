import EditProgramPage from "@/pages/admin/programs/EditProgramPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function EditProgram() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <EditProgramPage />
    </Suspense>
  );
}
