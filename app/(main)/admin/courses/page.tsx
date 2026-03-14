import CoursesPage from "@/pages/admin/courses/CoursesPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function Courses() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <CoursesPage />
    </Suspense>
  );
}
