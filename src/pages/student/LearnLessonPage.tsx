"use client";

import LearnLessonForm from "@/entities/lesson/ui/learnLesson";
import {
  LearnerLessonSummaryDto,
  SubmitPracticeApiArg,
  useCompleteTheoryLessonMutation,
  useCourseForLearnerQuery,
  useGetLessonForLearnerQuery,
  useStartLearningLessonMutation,
  useSubmitPracticeMutation,
} from "@/features/student/api/studentApi";
import LessonsIconsList from "@/features/student/ui/LessonsIconsList";
import { LessonTimer } from "@/features/student/ui/LessonTimer";
import { routes } from "@/shared/config/routes";
import FullscreenLoader from "@/shared/ui/FullScreenLoader";
import {
  Box,
  Typography,
  Alert,
  Divider,
  Button,
  Stack,
  Link,
  Snackbar,
  DialogActions,
  DialogContent,
} from "@mui/material";
import NextLink from "next/link";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function LearnLessonPage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params?.courseId as string;
  const lessonId = params?.lessonId as string;

  // Состояние для уведомлений
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "warning" });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const [startLearningLesson] = useStartLearningLessonMutation();
  const [completeTheory] = useCompleteTheoryLessonMutation();
  const [completePractice] = useSubmitPracticeMutation();

  useEffect(() => {
    if (lesson && !lesson.status) {
      if (lesson?.timeLimitMinutes) {
        setIsDialogOpen(true);
      } else {
        startLearningLesson(+lessonId);
      }
    }
  }, [lesson, lessonId, startLearningLesson]);

  const lessonProgress = course?.lessons?.find(
    (item) => item.id === lesson?.id
  )?.lessonProgress;

  const fullPoints = course?.lessons?.find(
    (item) => item.id === lesson?.id
  )?.fullPoints;

  const isLessonCompleted = lessonProgress?.status === "COMPLETED";

  const isLessonLast = lesson?.position === course?.lessons?.length;

  const testFormId = "testForm";
  const taskFormId = "taskForm";

  // Получаем следующий урок
  const getNextLesson = (): LearnerLessonSummaryDto | undefined => {
    if (!course?.lessons || isLessonLast) return undefined;
    const position = lesson?.position;
    if (position !== undefined) {
      return course.lessons.find(
        (lessonItem) => lessonItem.position === position + 1
      );
    } else {
      const currentIndex = course.lessons.findIndex(
        (l) => l.id === Number(lessonId)
      );
      return course.lessons[currentIndex + 1];
    }
  };

  const nextLesson = getNextLesson();

  // Автоматическая отправка при истечении времени
  const handleTimeUp = useCallback(async () => {
    if (!lesson || lesson.status !== "STARTED") return;

    try {
      // Для практических уроков отправляем форму

      const form = document.getElementById(
        lesson.lessonType === "PRACTICE_TEST" ? testFormId : taskFormId
      ) as HTMLFormElement;

      if (form) {
        form.requestSubmit();
      } else {
        // Если форма не найдена, показываем ошибку
        setSnackbar({
          open: true,
          message: "Не удалось автоматически отправить ответы.",
          severity: "error",
        });
      }

      setSnackbar({
        open: true,
        message: "Ваши ответы отправлены автоматически",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Ошибка при автоматической отправке ответов",
        severity: "error",
      });
      console.error("Ошибка автоматической отправки:", error);
    }
  }, [lesson, completeTheory, testFormId, taskFormId]);

  if (isCourseLoading || isLessonLoading) return <FullscreenLoader />;

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
        {course && (
          <LessonsIconsList course={course} activeLessonId={+lessonId} />
        )}

        {/* Основной контент */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          {/* Название урока */}
          <Typography variant="h1" sx={{ mx: "auto", mb: 4 }}>
            {lesson?.title}
          </Typography>

          {isDialogOpen ? (
            <>
              <Box mt={5}>
                <DialogContent
                  sx={{
                    textAlign: "center",
                    py: 4,
                    px: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5" component="h2" mb={1}>
                    Тест
                  </Typography>

                  <Typography variant="body2">
                    На прохождение теста дается {lesson?.timeLimitMinutes}{" "}
                    минут. Отсчет начнется сразу после начала теста.
                  </Typography>
                  {lesson?.maxAttempts ? (
                    <Typography variant="body2">
                      Осталось попыток ( {lesson?.attempts} /{" "}
                      {lesson?.maxAttempts})
                    </Typography>
                  ) : (
                    <></>
                  )}
                </DialogContent>

                <DialogActions
                  sx={{
                    p: 2,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      startLearningLesson(+lessonId);
                      setIsDialogOpen(false);
                    }}
                  >
                    Начать
                  </Button>
                </DialogActions>
              </Box>
            </>
          ) : (
            <>
              {/* Таймер ограничения времени */}
              {lesson && lesson.status === "STARTED" && (
                <LessonTimer
                  lessonId={lesson.id}
                  timeLimitMinutes={lesson.timeLimitMinutes}
                  onTimeUp={handleTimeUp}
                />
              )}

              {/* Обработка статуса урока, инфа по статусу */}
              {lesson?.status === "COMPLETED" && (
                <Box
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#EFF7DE", borderRadius: "5px" }}
                >
                  <Typography variant="body1">Урок пройден</Typography>
                  <Typography variant="body2">
                    Получено баллов: {lessonProgress?.pointsAwarded} /{" "}
                    {fullPoints}
                  </Typography>
                </Box>
              )}
              {lesson?.status === "INCOMPLETED" && (
                <Box
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#f4b2a3", borderRadius: "5px" }}
                >
                  <Typography variant="body1">Урок не пройден</Typography>
                </Box>
              )}
              {lesson?.status === "PENDING_REVIEW" && (
                <Box
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#f0e8a7", borderRadius: "5px" }}
                >
                  <Typography variant="body1">
                    Урок отправлен тренеру и ожидает его проверки
                  </Typography>
                </Box>
              )}
              {lesson?.status === "REWORKING" && (
                <Box
                  p={1}
                  my={2}
                  sx={{ bgcolor: "#f1caac", borderRadius: "5px" }}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {lesson?.lessonType === "PRACTICE_OPEN_ANSWER" ? (
                    <Typography variant="body1" display={"inline"}>
                      Тренер проверил ваши ответы и отправил урок на доработку
                    </Typography>
                  ) : (
                    <Typography variant="body1" display={"inline"}>
                      Урок не пройден, но вы можете его пересдать.
                      {lesson?.attempts && lesson?.maxAttempts
                        ? ` Осталось попыток (
                  ${lesson?.attempts} / ${lesson?.maxAttempts})`
                        : ""}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => {
                      lesson?.timeLimitMinutes
                        ? setIsDialogOpen(true)
                        : startLearningLesson(+lessonId);
                    }}
                  >
                    Пересдать урок
                  </Button>
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
                {lessonError && (
                  <Alert severity="error">Не удалось получить урок</Alert>
                )}

                {lesson && (
                  <LearnLessonForm
                    lesson={lesson}
                    lessonStatus={lesson?.status}
                    formId={
                      lesson?.lessonType === "PRACTICE_TEST"
                        ? testFormId
                        : taskFormId
                    }
                    onSubmit={(data: SubmitPracticeApiArg) => {
                      try {
                        completePractice(data);
                      } catch (err) {
                        setSnackbar({
                          open: true,
                          message: "Ошибка при отправке ответов",
                          severity: "error",
                        });
                        console.log(err);
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
                {lesson?.lessonType?.startsWith("THEORY_") ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => completeTheory(lesson.id)}
                    disabled={isLessonCompleted}
                  >
                    {isLessonCompleted ? "Урок завершен" : "Завершить урок"}
                  </Button>
                ) : (
                  lesson?.status === "STARTED" && (
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
                      Завершить урок
                    </Button>
                  )
                )}

                {nextLesson ? (
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
                    Следующий урок
                  </Button>
                ) : (
                  isLessonLast &&
                  course?.progress?.completionStatus !== "COMPLETED" && (
                    <Button
                      disabled={!isLessonCompleted}
                      onClick={() =>
                        router.push(routes.student.courseById(+courseId))
                      }
                    >
                      Завершить курс
                    </Button>
                  )
                )}
              </Stack>
            </>
          )}
        </Box>
      </Box>

      {/* Уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
