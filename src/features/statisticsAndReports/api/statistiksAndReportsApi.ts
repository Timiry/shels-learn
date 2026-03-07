import { baseApi as api } from "../../../shared/api/baseApi";
export const addTagTypes = [] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
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
        invalidatesTags: [],
      }),
      pendingReviews: build.query<
        PendingReviewsApiResponse,
        PendingReviewsApiArg
      >({
        query: () => ({ url: `/api/v1/admin/progress/reviews/pending` }),
        providesTags: [],
      }),
      reviewCourses: build.query<ReviewCoursesApiResponse, ReviewCoursesApiArg>(
        {
          query: () => ({ url: `/api/v1/admin/progress/reviews/courses` }),
          providesTags: [],
        }
      ),
      summaryCsv: build.query<SummaryCsvApiResponse, SummaryCsvApiArg>({
        query: () => ({ url: `/api/v1/admin/progress/reports/summary.csv` }),
        providesTags: [],
      }),
      courseSummaryCsv: build.query<
        CourseSummaryCsvApiResponse,
        CourseSummaryCsvApiArg
      >({
        query: (queryArg) => ({
          url: `/api/v1/admin/progress/courses/${queryArg}/summary-report.csv`,
        }),
        providesTags: [],
      }),
      courseStats: build.query<CourseStatsApiResponse, CourseStatsApiArg>({
        query: (queryArg) => ({
          url: `/api/v1/admin/progress/courses/${queryArg}/stats`,
        }),
        providesTags: [],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as statistiksAndReportsApi };
export type ReviewOpenAnswerApiResponse =
  /** status 200 Результат проверки сохранён */ SubmissionResultDto;
export type ReviewOpenAnswerApiArg = {
  submissionId: number;
  reviewOpenSubmissionRequest: ReviewOpenSubmissionRequest;
};
export type PendingReviewsApiResponse =
  /** status 200 Список ответов для проверки */ PendingSubmissionDto;
export type PendingReviewsApiArg = void;
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
export type SubmissionResultDto = {
  submissionId?: number;
  status?: "COMPLETE" | "INCOMPLETE" | "PENDING_REVIEW" | "REWORK" | "ACCEPTED";
  passed?: boolean;
  message?: string;
};
export type ApiResponse = {
  message?: string;
};
export type ReviewOpenSubmissionRequest = {
  /** Финальный результат проверки */
  passed?: boolean;
  /** Выдать частичные баллы */
  partialPoints?: boolean;
  /** Вернуть на доработку */
  toNextReview?: boolean;
  /** Комментарий проверяющего */
  comment?: string;
};
export type PendingSubmissionDto = {
  submissionId?: number;
  lessonId?: number;
  lessonTitle?: string;
  studentId?: number;
  studentUsername?: string;
  answer?: string;
  submittedAt?: string;
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
  useReviewCoursesQuery,
  useSummaryCsvQuery,
  useCourseSummaryCsvQuery,
  useCourseStatsQuery,
} = injectedRtkApi;
