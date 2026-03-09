"use client";

import { extractYouTubeVideoId } from "@/entities/lesson/lib/utils/validationYoutubeUrl";
import LearnTaskLessonForm from "@/entities/lesson/ui/learnPracticeLesson/LearnTaskLessonForm";
import LearnTestLessonForm from "@/entities/lesson/ui/learnPracticeLesson/LearnTestLessonForm";
import PdfLessonContent from "@/entities/lesson/ui/lessonContent/PdfLessonContent";
import TextLessonContent from "@/entities/lesson/ui/lessonContent/TextLessonContent";
import VideoLessonContent from "@/entities/lesson/ui/lessonContent/VideoLessonContent";
import lessonTypeToIcon from "@/entities/lesson/ui/lessonTypeToIcon";
import {
  LearnerLessonSummaryDto,
  SubmitPracticeApiArg,
  useCompleteTheoryLessonMutation,
  useCourseForLearnerQuery,
  useGetLessonForLearnerQuery,
  useSubmitPracticeMutation,
} from "@/features/student/api/studentApi";
import { routes } from "@/shared/config/routes";
import {
  Box,
  Typography,
  Alert,
  Divider,
  useTheme,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Link,
} from "@mui/material";
import NextLink from "next/link";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function LearnLessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useCourseForLearnerQuery(+courseId);

  const {
    data: lesson,
    isLoading: isLessonLoading,
    error: lessonError,
    refetch,
  } = useGetLessonForLearnerQuery(+lessonId);

  const [completeTheory] = useCompleteTheoryLessonMutation();
  const [completePractice] = useSubmitPracticeMutation();

  const isLessonCompleted = course?.lessons?.find(
    (item) => item.id === lesson?.id
  )?.passed;

  const videoUrl = lesson?.theoryContent || "";
  const youtubeId = extractYouTubeVideoId(videoUrl);

  const testFormId = "testForm";
  const taskFormId = "taskForm";

  // Обработчик завершения урока
  const handleLessonCompletion = () => {
    try {
      if (lesson?.lessonType.includes("THEORY")) {
        completeTheory(lesson.id);
      } else {
        // completePractice();
      }
    } catch (err) {
      console.error("Ошибка завершения урока:", err);
    }
  };

  // Получаем следующий урок
  const getNextLesson = (): LearnerLessonSummaryDto | null => {
    if (!course?.lessons) return null;

    const currentIndex = course.lessons.findIndex(
      (l) => l.id === Number(lessonId)
    );
    if (currentIndex === -1 || currentIndex >= course.lessons.length - 1) {
      return null;
    }

    return course.lessons[currentIndex + 1];
  };

  const nextLesson = getNextLesson();

  // Проверка, является ли текущий урок последним //TODO: обработать завершение курса, выводить инфу о завершении
  const isLastLesson = () => {
    if (!course?.lessons) return false;
    const currentIndex = course.lessons.findIndex(
      (l) => l.id === Number(lessonId)
    );
    return currentIndex === course.lessons.length - 1;
  };

  if (isCourseLoading || isLessonLoading) return <CircularProgress />;

  return (
    <>
      <Link component={NextLink} href={routes.student.courseById(courseId)}>
        <Typography variant="body2" p={"10px 28px"}>
          {course?.title}
        </Typography>
      </Link>
      <Divider />
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 41px)" }}>
        {/* Левая панель с уроками */}
        <Box
          sx={{
            // width: 300,
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
                const isCurrentLesson = lessonItem.id === Number(lessonId);
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
                          `/student/learning/course/${courseId}/lesson/${lessonItem.id}`
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
                            : lessonItem.passed
                              ? "success.dark"
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

        {/* Основной контент */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          {/* Название урока */}
          <Typography variant="h1" sx={{ mx: "auto", mb: 4 }}>
            {lesson?.title}
          </Typography>

          {isLessonCompleted && (
            <Box p={1} my={2} sx={{ bgcolor: "#EFF7DE", borderRadius: "5px" }}>
              <Typography variant="body1">Урок пройден</Typography>
              <Typography variant="body2">
                Получено баллов:{" "}
                {
                  course.lessons?.find((item) => item?.id === lesson?.id)
                    ?.pointsAwarded
                }
              </Typography>
            </Box>
          )}

          {/* Контент урока */}
          <Box
            sx={{
              flex: 1,
              mb: 3,
              borderRadius: 1,
              bgcolor: "background.paper",
            }}
          >
            {!lesson && (
              <Alert severity="error">Не удалось получить урок</Alert>
            )}

            {lesson?.lessonType === "THEORY_PDF" && (
              <Box>
                {lesson?.theoryContent && (
                  <embed
                    src={process.env.NEXT_PUBLIC_API_URL + lesson.theoryContent}
                    type="application/pdf"
                    width="100%"
                    height="700px"
                  />
                )}
              </Box>
            )}
            {lesson?.lessonType === "THEORY_TEXT" && (
              <Box
                width={"80%"}
                mx={"auto"}
                dangerouslySetInnerHTML={{ __html: lesson.theoryContent || "" }}
              ></Box>
            )}
            {lesson?.lessonType === "THEORY_VIDEO" && (
              <Box display={"flex"} justifyContent={"center"}>
                {youtubeId ? (
                  <iframe
                    width="800"
                    height="500"
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <Alert severity="error" sx={{ my: 2 }}>
                    Невозможно проиграть видео: неверная YouTube ссылка.
                  </Alert>
                )}
              </Box>
            )}
            {lesson?.lessonType === "PRACTICE_TEST" && (
              <LearnTestLessonForm
                lesson={lesson}
                formId={testFormId}
                onSubmit={completePractice}
              />
            )}
            {lesson?.lessonType === "PRACTICE_OPEN_ANSWER" && (
              <LearnTaskLessonForm
                lesson={lesson}
                formId={taskFormId}
                onSubmit={(data: SubmitPracticeApiArg) => {
                  try {
                    completePractice(data);
                    alert(
                      "Ваши ответы на это задание отправлены тренеру и ожидают проверки"
                    );
                  } catch (err: any) {
                    console.log("Ошибка отправки ответов на задания");
                  }
                }}
              />
            )}
          </Box>

          {/* Нижняя панель с кнопками */}
          <Stack
            justifyContent="end"
            direction="row"
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 2,
              pb: 1,
            }}
          >
            {lesson?.lessonType.includes("THEORY") ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleLessonCompletion()}
                disabled={isLessonCompleted}
              >
                {isLessonCompleted ? "Урок завершен" : "Завершить урок"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled={isLessonCompleted}
                type="submit"
                form={
                  lesson?.lessonType === "PRACTICE_TEST"
                    ? testFormId
                    : taskFormId
                }
              >
                {isLessonCompleted ? "Урок завершен" : "Завершить урок"}
              </Button>
            )}

            <Button
              variant="outlined"
              disabled={nextLesson?.blocked}
              onClick={() => {
                router.push(
                  nextLesson
                    ? routes.student.lessonById(courseId, nextLesson.id)
                    : routes.student.courseById(courseId)
                );
              }}
            >
              {nextLesson ? "Следующий урок" : "Завершить курс"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
