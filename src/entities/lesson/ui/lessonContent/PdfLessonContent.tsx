import Box from "@mui/material/Box";

export default function PdfLessonContent<T extends { theoryContent?: string }>({
  lesson,
}: {
  lesson: T;
}) {
  return (
    <Box>
      {lesson.theoryContent && (
        <embed
          src={"http://217.26.31.189" + lesson.theoryContent}
          type="application/pdf"
          width="100%"
          style={{ aspectRatio: "4 / 3" }}
        />
      )}
    </Box>
  );
}
