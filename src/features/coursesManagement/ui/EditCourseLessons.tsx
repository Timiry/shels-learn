import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
  LessonType,
} from "@/entities/course/model/coursesApi";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import LessonsList from "./LessonsList";
import { useState } from "react";
import LessonContent from "@/entities/lesson/ui/lessonContent";
import CreateLessonMenu from "./CreateLessonMenu";
import EditLesson from "@/entities/lesson/ui/editLesson";
import {
  useCreatePracticeLessonMutation,
  useCreateTheoryLessonMutation,
  useDeleteLessonMutation,
  useUpdatePracticeLessonMutation,
  useUpdateTheoryLessonMutation,
} from "@/entities/course/model/coursesApi";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ConfirmDeleteModal from "@/shared/ui/ConfirmDeleteModal";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/config/routes";

interface EditCourseLessonsProps {
  lessons: LessonDto[];
  courseId: number;
  activeLessonId?: string | null;
  mode?: string | null;
  lessonType?: string | null;
}
export default function EditCourseLessons({
  lessons,
  courseId,
  activeLessonId,
  mode,
  lessonType,
}: EditCourseLessonsProps) {
  const activeLesson = activeLessonId
    ? lessons.find((lesson) => lesson.id === +activeLessonId)
    : undefined;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [createPracticeLesson] = useCreatePracticeLessonMutation();
  const [createTheoryLesson] = useCreateTheoryLessonMutation();
  const [updatePracticeLesson] = useUpdatePracticeLessonMutation();
  const [updateTheoryLesson] = useUpdateTheoryLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

  const router = useRouter();

  const lessonTypeToWord = {
    THEORY_TEXT: "ТЕКСТ",
    THEORY_VIDEO: "ВИДЕО",
    THEORY_PDF: "PDF",
    PRACTICE_TEST: "ТЕСТ",
    PRACTICE_OPEN_ANSWER: "ЗАДАНИЕ",
  };

  return (
    <Box display={"flex"} flexDirection={"row"}>
      <LessonsList
        activeLessonId={activeLessonId ? +activeLessonId : undefined}
        lessons={lessons}
        onLessonClik={(lessonId: number | undefined) => {
          if (lessonId)
            router.push(
              routes.admin.courses.viewCourseLesson(courseId, lessonId)
            );
        }}
        onCreateLessonClik={() =>
          router.push(
            routes.admin.courses.editCourseByIdAndTab(courseId, "lessons")
          )
        }
      />
      <Box
        flexGrow={1}
        sx={{
          height: "calc(100vh - 165px)",
          overflowY: "auto",
        }}
      >
        {/* содержание выбранного урока */}
        {activeLesson && mode === "view" && (
          <Box maxWidth={"80%"} mx={"auto"}>
            <Stack justifyContent={"space-between"} direction={"row"} pb={3}>
              <Typography variant="caption">
                {lessonTypeToWord[activeLesson.lessonType]}
              </Typography>
              <Box>
                <IconButton
                  sx={{
                    p: 0.5,
                    mr: 2,
                    border: "1px solid",
                    borderRadius: 1,
                    borderColor: "divider",
                  }}
                  onClick={() => {
                    router.push(
                      routes.admin.courses.editCourseLesson(
                        courseId,
                        activeLesson.id
                      )
                    );
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  sx={{
                    p: 0.5,
                    border: "1px solid",
                    borderRadius: 1,
                    borderColor: "divider",
                  }}
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon color="error" fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
            <LessonContent lesson={activeLesson} />
          </Box>
        )}

        {/* редактирование выбранного урока */}
        {activeLesson && mode === "edit" && (
          <Box maxWidth={"80%"} mx={"auto"}>
            <Box pb={3}>
              <Typography variant="caption">
                РЕДАКТИРОВАНИЕ УРОКА {" > "}
                {lessonTypeToWord[activeLesson.lessonType]}
              </Typography>
            </Box>
            <EditLesson
              onSubmit={(lessonInfo) => {
                activeLesson.lessonType.startsWith("THEORY")
                  ? updateTheoryLesson({
                      courseId: activeLesson.courseId,
                      lessonId: activeLesson.id,
                      updateTheoryLessonRequest:
                        lessonInfo as CreateTheoryLessonRequest,
                    })
                  : updatePracticeLesson({
                      courseId: activeLesson.courseId,
                      lessonId: activeLesson.id,
                      updatePracticeLessonRequest:
                        lessonInfo as CreatePracticeLessonRequest,
                    });
                router.push(
                  routes.admin.courses.viewCourseLesson(
                    courseId,
                    activeLesson.id
                  )
                );
              }}
              onCancel={() => {
                router.push(
                  routes.admin.courses.viewCourseLesson(
                    courseId,
                    activeLesson.id
                  )
                );
              }}
              isCreation={false}
              lessonType={activeLesson.lessonType}
              currentValues={activeLesson}
            />
          </Box>
        )}

        {/* создание нового урока */}
        {mode === "create" && lessonType && (
          <Box maxWidth={"80%"} mx={"auto"}>
            <Box pb={3}>
              <Typography variant="caption">
                СОЗДАНИЕ УРОКА {" > "}
                {lessonTypeToWord[lessonType as LessonType]}
              </Typography>
            </Box>
            <EditLesson
              onSubmit={async (lessonInfo) => {
                const newLesson = lessonType.startsWith("THEORY")
                  ? await createTheoryLesson({
                      courseId: courseId,
                      createTheoryLessonRequest:
                        lessonInfo as CreateTheoryLessonRequest,
                    }).unwrap()
                  : await createPracticeLesson({
                      courseId: courseId,
                      createPracticeLessonRequest:
                        lessonInfo as CreatePracticeLessonRequest,
                    }).unwrap();
                router.push(
                  routes.admin.courses.viewCourseLesson(courseId, newLesson.id)
                );
              }}
              onCancel={() => {
                router.push(
                  routes.admin.courses.editCourseByIdAndTab(courseId, "lessons")
                );
              }}
              isCreation={true}
              lessonType={lessonType as LessonType}
            />
          </Box>
        )}

        {/* меню для выбора типа нового урока */}
        {!activeLesson && !lessonType && (
          <CreateLessonMenu
            onIconClick={(lessonType: LessonType) =>
              router.push(
                routes.admin.courses.createCourseLesson(courseId, lessonType)
              )
            }
          />
        )}
      </Box>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (activeLesson) {
            deleteLesson({ courseId: courseId, lessonId: activeLesson?.id });
            setIsDeleteModalOpen(false);
            router.push(
              routes.admin.courses.editCourseByIdAndTab(courseId, "lessons")
            );
          }
        }}
        objectname={activeLesson?.title || ""}
        objectType="lesson"
      />
    </Box>
  );
}
