import { LessonDto } from "@/entities/course/model/types";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

export default function PdfLessonContent({ lesson }: { lesson: LessonDto }) {
  return (
    <Box>
      <embed
        src={lesson.theoryContent}
        type="application/pdf"
        width="100%"
        height="700px"
      />
    </Box>
  );
}
