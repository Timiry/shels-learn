import CreateCoursePage from "@/pages/admin/courses/CreateCoursePage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function CreateCourse() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <CreateCoursePage />
    </Suspense>
  );
}
