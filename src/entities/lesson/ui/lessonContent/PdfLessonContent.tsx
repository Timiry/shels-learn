import { LessonDto } from "@/entities/course/model/coursesApi";
import Box from "@mui/material/Box";

export default function PdfLessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box>
      {lesson.theoryContent && (
        <embed
          src={"http://217.26.31.189" + lesson.theoryContent}
          type="application/pdf"
          width="100%"
          height="700px"
        />
      )}
    </Box>
  );
}
