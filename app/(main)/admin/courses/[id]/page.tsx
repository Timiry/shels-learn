import CourseInfoPage from "@/pages/admin/courses/CourseInfoPage";
import CircularProgress from "@mui/material/CircularProgress";
import { Suspense } from "react";

export default function CourseInfo() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <CourseInfoPage />
    </Suspense>
  );
}
