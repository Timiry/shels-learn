import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  currentValues?: LessonDto;
  isCreation: boolean;
}

export default function EditPdfLessonForm({
  onSubmit,
  currentValues,
  isCreation,
}: EditLessonFormProps) {
  return <Box></Box>;
}
