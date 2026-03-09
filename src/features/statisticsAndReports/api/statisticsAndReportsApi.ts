import { baseApi as api } from "../../../shared/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    reviewOpenAnswer: build.mutation<
      ReviewOpenAnswerApiResponse,
      ReviewOpenAnswerApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/progress/reviews/${queryArg.submissionId}`,
        method: "POST",
        body: queryArg.reviewOpenSubmissionRequest,
      }),
      invalidatesTags: ["Review"],
    }),
    pendingReviews: build.query<
      PendingReviewsApiResponse,
      PendingReviewsApiArg
    >({
      query: () => ({ url: `/api/v1/admin/progress/reviews/pending` }),
      providesTags: ["Review"],
    }),
    pendingReviewQuestions: build.query<
      PendingReviewQuestionsApiResponse,
      PendingReviewQuestionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/progress/reviews/pending/${queryArg}`,
      }),
      providesTags: ["Review"],
    }),
    reviewCourses: build.query<ReviewCoursesApiResponse, ReviewCoursesApiArg>({
      query: () => ({ url: `/api/v1/admin/progress/reviews/courses` }),
      providesTags: ["Review"],
    }),
    summaryCsv: build.query<SummaryCsvApiResponse, SummaryCsvApiArg>({
      query: () => ({ url: `/api/v1/admin/progress/reports/summary.csv` }),
    }),
    courseSummaryCsv: build.query<
      CourseSummaryCsvApiResponse,
      CourseSummaryCsvApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/progress/courses/${queryArg}/summary-report.csv`,
      }),
    }),
    courseStats: build.query<CourseStatsApiResponse, CourseStatsApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/progress/courses/${queryArg}/stats`,
      }),
      providesTags: ["Course", "Review", "Learning"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as Api };
export type ReviewOpenAnswerApiResponse =
  /** status 200 Результат проверки сохранён */ SubmissionResultDto;
export type ReviewOpenAnswerApiArg = {
  submissionId: number;
  reviewOpenSubmissionRequest: ReviewOpenSubmissionRequest;
};
export type PendingReviewsApiResponse =
  /** status 200 Список submissions для проверки по урокам */ PendingSubmissionDto[];
export type PendingReviewsApiArg = void;
export type PendingReviewQuestionsApiResponse =
  /** status 200 Список вопросов submission для ревью */ PendingSubmissionQuestionDto[];
export type PendingReviewQuestionsApiArg = number;
export type ReviewCoursesApiResponse =
  /** status 200 Список курсов reviewer */ CourseSummaryDto;
export type ReviewCoursesApiArg = void;
export type SummaryCsvApiResponse = unknown;
export type SummaryCsvApiArg = void;
export type CourseSummaryCsvApiResponse = unknown;
export type CourseSummaryCsvApiArg = number;
export type CourseStatsApiResponse =
  /** status 200 Статистика по курсу */ CourseStudentStatDto[];
export type CourseStatsApiArg = number;

export type SubmissionLessonStatus =
  | "COMPLETE"
  | "INCOMPLETE"
  | "PENDING_REVIEW"
  | "REWORK";
export type SubmissionResultDto = {
  submissionId?: number;
  status?: SubmissionLessonStatus;
  passed?: boolean;
  message?: string;
};
export type ApiResponse = {
  message?: string;
};

export type SubmissionQuestionStatus =
  | "PENDING_REVIEW"
  | "ACCEPTED"
  | "REWORK"
  | "REJECTED";
export type ReviewQuestionDecisionDto = {
  /** Статус проверки вопроса */
  submissionStatus?: SubmissionQuestionStatus;
  /** Баллы за вопрос */
  awardedPoints?: number;
  /** Комментарий ревьювера */
  reviewComment?: string;
};
export type ReviewOpenSubmissionRequest = {
  /** Решения по индексам вопросов: questionIndex -> решение ревью */
  questionReviews?: {
    [key: string]: ReviewQuestionDecisionDto;
  };
};
export type PendingSubmissionDto = {
  /** ID submission */
  submissionId: number;
  /** ID урока */
  lessonId: number;
  /** Название урока */
  lessonTitle?: string;
  /** ID курса */
  courseId: number;
  /** Название курса */
  courseTitle?: string;
  /** ID студента */
  studentId: number;
  /** ФИО студента */
  studentFullname?: string;
  /** Дата отправки submission */
  submittedAt?: string;
  /** Номер попытки */
  attempt?: number;
};
export type PendingSubmissionQuestionDto = {
  /** Индекс вопроса */
  questionIndex?: number;
  /** Статус вопроса в review */
  submissionStatus?: SubmissionQuestionStatus;
  /** Текст вопроса */
  questionText?: string;
  /** Подсказка для тренера */
  trainerHint?: string;
  /** Выставленные баллы */
  awardedPoints?: number;
  /** Максимальные баллы за вопрос */
  fullPoints?: number;
  /** Ответ студента */
  answer?: string;
  /** Комментарий ревьювера */
  reviewComment?: string;
};
export type CourseSummaryDto = {
  id?: number;
  title?: string;
  description?: string;
  coverFilePath?: string;
  sectionId?: number;
  sectionTitle?: string;
  sectionPriority?: number;
  theoryLessonsCount?: number;
  practiceLessonsCount?: number;
};
export type CourseStudentStatDto = {
  studentId?: number;
  fullName?: string;
  email?: string;
  username?: string;
  earnedPoints?: number;
  maxPoints?: number;
  efficiencyPercent?: number;
  progressPercent?: number;
  completedLessons?: number;
  totalLessons?: number;
  enrolledAt?: string;
  startedAt?: string;
  completedAt?: string;
};
export const {
  useReviewOpenAnswerMutation,
  usePendingReviewsQuery,
  usePendingReviewQuestionsQuery,
  useReviewCoursesQuery,
  useSummaryCsvQuery,
  useCourseSummaryCsvQuery,
  useCourseStatsQuery,
} = injectedRtkApi;
