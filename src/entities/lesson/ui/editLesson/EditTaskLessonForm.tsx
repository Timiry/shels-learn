import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
} from "@/entities/course/model/types";
import Box from "@mui/material/Box";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  onCancel: () => void;

  currentValues?: LessonDto;
  isCreation: boolean;
}
export default function EditTaskLessonForm({
  onSubmit,
  onCancel,
  currentValues,
  isCreation,
}: EditLessonFormProps) {
  return <Box></Box>;
}
