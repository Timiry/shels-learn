import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { CourseLearnerDto } from "../api/studentApi";
import { useRouter } from "next/navigation";

export default function LessonsIconsList({
  course,
  activeLessonId,
}: {
  course: CourseLearnerDto;
  activeLessonId: number;
}) {
  const router = useRouter();
  return (
    <Box
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Список уроков */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "background.default",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "divider",
            borderRadius: "3px",
          },
        }}
      >
        <List>
          {course?.lessons?.map((lessonItem) => {
            const isCurrentLesson = lessonItem.id === Number(activeLessonId);
            return (
              <ListItem
                key={lessonItem.id}
                disablePadding
                sx={{
                  mb: 0.5,
                  borderRadius: 1,
                }}
              >
                <ListItemButton
                  selected={isCurrentLesson}
                  disabled={lessonItem.blocked}
                  onClick={() =>
                    router.push(
                      `/student/learning/course/${course.id}/lesson/${lessonItem.id}`
                    )
                  }
                  sx={{
                    borderRadius: 1,
                    "&.Mui-selected": {
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      justifyContent: "center",
                      color: isCurrentLesson
                        ? "primary.main"
                        : lessonItem.lessonProgress?.status === "COMPLETED"
                          ? "success.dark"
                          : lessonItem.lessonProgress?.status === "INCOMPLETED"
                            ? "error.main"
                            : lessonItem.lessonProgress?.status ===
                                "PENDING_REVIEW"
                              ? "warning.light"
                              : lessonItem.lessonProgress?.status ===
                                  "REWORKING"
                                ? "warning.dark"
                                : "text.secondary",
                    }}
                  >
                    {lessonTypeToIcon[lessonItem.lessonType]}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
