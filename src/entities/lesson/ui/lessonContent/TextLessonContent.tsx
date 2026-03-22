import Box from "@mui/material/Box";

export default function TextLessonContent<
  T extends { theoryContent?: string },
>({ lesson }: { lesson: T }) {
  return (
    <Box dangerouslySetInnerHTML={{ __html: lesson.theoryContent || "" }}></Box>
  );
}
