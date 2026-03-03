import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
  LessonType,
} from "@/entities/course/model/types";
import Box from "@mui/material/Box";
import EditPdfLesson from "./EditPdfLessonForm";
import EditTextLesson from "./EditTextLessonForm";
import EditVideoLesson from "./EditVideoLessonForm";
import EditTestLesson from "./EditTestLessonForm";
import EditTaskLesson from "./EditTaskLessonForm";

interface EditLessonFormProps {
  onSubmit: (
    lessonInfo: CreateTheoryLessonRequest | CreatePracticeLessonRequest
  ) => void;
  isCreation: boolean;
  currentValues?: LessonDto;
  lessonType: LessonType;
}

export default function EditLesson({
  onSubmit,
  isCreation,
  currentValues,
  lessonType,
}: EditLessonFormProps) {
  return (
    <Box>
      {lessonType === "THEORY_PDF" && (
        <EditPdfLesson
          onSubmit={onSubmit}
          currentValues={currentValues}
          isCreation={isCreation}
        />
      )}

      {lessonType === "THEORY_TEXT" && (
        <EditTextLesson
          onSubmit={onSubmit}
          currentValues={currentValues}
          isCreation={isCreation}
        />
      )}

      {lessonType === "THEORY_VIDEO" && (
        <EditVideoLesson
          onSubmit={onSubmit}
          currentValues={currentValues}
          isCreation={isCreation}
        />
      )}

      {lessonType === "PRACTICE_TEST" && (
        <EditTestLesson
          onSubmit={onSubmit}
          currentValues={currentValues}
          isCreation={isCreation}
        />
      )}

      {lessonType === "PRACTICE_OPEN_ANSWER" && (
        <EditTaskLesson
          onSubmit={onSubmit}
          currentValues={currentValues}
          isCreation={isCreation}
        />
      )}
    </Box>
  );
}
