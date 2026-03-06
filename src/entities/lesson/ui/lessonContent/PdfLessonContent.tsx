import { LessonDto } from "@/entities/course/model/types";
import Box from "@mui/material/Box";

export default function PdfLessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box>
      {lesson.theoryContent && (
        <embed
          src={process.env.NEXT_PUBLIC_API_URL + lesson.theoryContent}
          type="application/pdf"
          width="100%"
          height="700px"
        />
      )}
    </Box>
  );
}
