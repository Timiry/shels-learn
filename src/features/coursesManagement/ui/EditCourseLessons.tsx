import {
  CreatePracticeLessonRequest,
  CreateTheoryLessonRequest,
  LessonDto,
  LessonType,
} from "@/entities/course/model/types";
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

export default function EditCourseLessons({
  lessons,
  courseId,
}: {
  lessons: LessonDto[];
  courseId: number;
}) {
  const [activeLesson, setActiveLesson] = useState<LessonDto>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [lessonType, setLessonType] = useState<LessonType>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [createPracticeLesson] = useCreatePracticeLessonMutation();
  const [createTheoryLesson] = useCreateTheoryLessonMutation();
  const [updatePracticeLesson] = useUpdatePracticeLessonMutation();
  const [updateTheoryLesson] = useUpdateTheoryLessonMutation();
  const [deleteLesson] = useDeleteLessonMutation();

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
        activeLessonId={activeLesson?.id}
        lessons={lessons}
        onLessonClik={(lesson: LessonDto | undefined) => {
          setIsEdit(false);
          setLessonType(undefined);
          setActiveLesson(lesson);
        }}
      />
      <Box
        flexGrow={1}
        sx={{
          height: "calc(100vh - 165px)",
          overflowY: "auto",
        }}
      >
        {/* содержание выбранного урока */}
        {activeLesson && !isEdit && (
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
                    setIsEdit(true);
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
        {activeLesson && isEdit && (
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
                setIsEdit(false);
              }}
              onCancel={() => {
                setIsEdit(false);
                setLessonType(undefined);
              }}
              isCreation={false}
              lessonType={activeLesson.lessonType}
              currentValues={activeLesson}
            />
          </Box>
        )}

        {/* создание нового урока */}
        {!activeLesson && lessonType && (
          <Box maxWidth={"80%"} mx={"auto"}>
            <Box pb={3}>
              <Typography variant="caption">
                СОЗДАНИЕ УРОКА {" > "}
                {lessonTypeToWord[lessonType]}
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
                setIsEdit(false);
                setLessonType(undefined);
                setActiveLesson(newLesson);
              }}
              onCancel={() => {
                setIsEdit(false);
                setLessonType(undefined);
              }}
              isCreation={true}
              lessonType={lessonType}
            />
          </Box>
        )}

        {/* меню для выбора типа нового урока */}
        {!activeLesson && !lessonType && (
          <CreateLessonMenu onIconClick={setLessonType} />
        )}
      </Box>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (activeLesson) {
            deleteLesson({ courseId: courseId, lessonId: activeLesson?.id });
            setActiveLesson(undefined);
            setIsEdit(false);
            setLessonType(undefined);
            setIsDeleteModalOpen(false);
          }
        }}
        objectname={activeLesson?.title || ""}
        objectType="lesson"
      />
    </Box>
  );
}
