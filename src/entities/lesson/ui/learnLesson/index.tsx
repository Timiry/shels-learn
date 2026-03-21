import Box from "@mui/material/Box";
import PdfLessonContent from "../lessonContent/PdfLessonContent";
import TextLessonContent from "../lessonContent/TextLessonContent";
import VideoLessonContent from "../lessonContent/VideoLessonContent";
import LearnTestLessonForm from "./LearnTestLessonForm";
import LearnTaskLessonForm from "./LearnTaskLessonForm";
import {
  LearnerLessonDto,
  LessonProgressStatus,
  SubmitPracticeApiArg,
} from "@/features/student/api/studentApi";

interface LearnLessonFormProps {
  lesson: LearnerLessonDto;

  lessonStatus?: LessonProgressStatus;
  formId: string;
  onSubmit: (data: SubmitPracticeApiArg) => void;
}

export default function LearnLessonForm({
  lesson,
  lessonStatus,
  formId,
  onSubmit,
}: LearnLessonFormProps) {
  return (
    <Box>
      {lesson.lessonType === "THEORY_PDF" && (
        <PdfLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "THEORY_TEXT" && (
        <TextLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "THEORY_VIDEO" && (
        <VideoLessonContent lesson={lesson} />
      )}

      {lesson.lessonType === "PRACTICE_TEST" && (
        <LearnTestLessonForm
          lesson={lesson}
          lessonStatus={lessonStatus}
          formId={formId}
          onSubmit={onSubmit}
        />
      )}

      {lesson.lessonType === "PRACTICE_OPEN_ANSWER" && (
        <LearnTaskLessonForm
          lesson={lesson}
          lessonStatus={lessonStatus}
          formId={formId}
          onSubmit={onSubmit}
        />
      )}
    </Box>
  );
}
