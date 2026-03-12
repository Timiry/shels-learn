import EditCoursePage from "@/pages/admin/courses/EditCoursePage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function EditCourse() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <EditCoursePage />
    </Suspense>
  );
}
