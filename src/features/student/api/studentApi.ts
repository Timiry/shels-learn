import { baseApi as api } from "../../../shared/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateMyLastVisit: build.mutation<
      UpdateMyLastVisitApiResponse,
      UpdateMyLastVisitApiArg
    >({
      query: () => ({ url: `/api/v1/student/my/last-visit`, method: "POST" }),
    }),
    submitPractice: build.mutation<
      SubmitPracticeApiResponse,
      SubmitPracticeApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/student/lessons/${queryArg.lessonId}/submit-practice`,
        method: "POST",
        body: queryArg.practiceSubmissionRequest,
      }),
    }),
    myProfile: build.query<MyProfileApiResponse, MyProfileApiArg>({
      query: () => ({ url: `/api/v1/student/my/profile` }),
      providesTags: ["Profile"],
    }),
    updateMyProfile: build.mutation<
      UpdateMyProfileApiResponse,
      UpdateMyProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/student/my/profile`,
        method: "PATCH",
        body: queryArg,
      }),
      invalidatesTags: ["Profile"],
    }),
    myStats: build.query<MyStatsApiResponse, MyStatsApiArg>({
      query: () => ({ url: `/api/v1/student/my/stats` }),
    }),
    myPrograms: build.query<MyProgramsApiResponse, MyProgramsApiArg>({
      query: () => ({ url: `/api/v1/student/my/programs` }),
    }),
    myProgram: build.query<MyProgramApiResponse, MyProgramApiArg>({
      query: (queryArg) => ({ url: `/api/v1/student/my/programs/${queryArg}` }),
    }),
    myCourses: build.query<MyCoursesApiResponse, MyCoursesApiArg>({
      query: () => ({ url: `/api/v1/student/my/courses` }),
    }),
    getLessonForLearner: build.query<
      GetLessonForLearnerApiResponse,
      GetLessonForLearnerApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/student/lessons/${queryArg}` }),
    }),
    courseForLearner: build.query<
      CourseForLearnerApiResponse,
      CourseForLearnerApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/student/courses/${queryArg}` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as studentApi };
export type UpdateMyLastVisitApiResponse =
  /** status 200 Дата последнего визита обновлена */ UserDto;
export type UpdateMyLastVisitApiArg = void;
export type UploadMyAvatarApiResponse =
  /** status 200 Аватар обновлен */ UserDto;
export type UploadMyAvatarApiArg = {
  file: File;
};
export type SubmitPracticeApiResponse =
  /** status 200 Ответы отправлены */ SubmissionResultDto;
export type SubmitPracticeApiArg = {
  lessonId: number;
  practiceSubmissionRequest: PracticeSubmissionRequest;
};
export type MyProfileApiResponse =
  /** status 200 Профиль текущего пользователя */ StudentProfileDto;
export type MyProfileApiArg = void;
export type UpdateMyProfileApiResponse =
  /** status 200 Профиль обновлён */ StudentProfileDto;
export type UpdateMyProfileApiArg = UpdateMyProfileRequest;
export type MyStatsApiResponse =
  /** status 200 Личная статистика */ StudentCourseStatDto[];
export type MyStatsApiArg = void;
export type MyProgramsApiResponse = unknown;
export type MyProgramsApiArg = void;
export type MyProgramApiResponse = unknown;
export type MyProgramApiArg = number;
export type MyCoursesApiResponse =
  /** status 200 Список назначенных курсов */ CourseDto;
export type MyCoursesApiArg = void;
export type GetLessonForLearnerApiResponse =
  /** status 200 Урок для прохождения */ LearnerLessonDto;
export type GetLessonForLearnerApiArg = number;
export type CourseForLearnerApiResponse =
  /** status 200 Детали курса */ CourseLearnerDto;
export type CourseForLearnerApiArg = number;
export type UserDto = {
  id?: number;
  fullName?: string;
  email?: string;
  role?: "ADMIN" | "STUDENT";
  activation?: boolean;
  enabled?: boolean;
  phone?: string;
  comment?: string;
  avatarFilePath?: string;
  createdAt?: string;
  createdBy?: string;
  lastVisit?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
};
export type ApiResponse = {
  message?: string;
};
export type SubmissionResultDto = {
  submissionId?: number;
  status?: "COMPLETE" | "INCOMPLETE" | "PENDING_REVIEW" | "REWORK" | "ACCEPTED";
  passed?: boolean;
  message?: string;
};
export type PracticeSubmissionRequest = {
  /** Текст open-ended ответа (для соответствующего типа вопроса) */
  openAnswer?: string;
  selectedAnswers?: string[];
  /** Ответы по индексам вопросов: questionIndex -> список ответов */
  questionAnswers?: {
    [key: string]: string[];
  };
};
export type GroupDto = {
  id?: string;
  title?: string;
  type?: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};
export type StudentProfileDto = {
  user: UserDto;
  groups: GroupDto[];
};
export type UpdateMyProfileRequest = {
  fullName: string;
  phone?: string;
  comment?: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  avatarFilePath?: string;
  password?: string;
};
export type StudentCourseStatDto = {
  courseId?: number;
  courseTitle?: string;
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
export type CourseDto = {
  id?: number;
  title?: string;
  description?: string;
  authorFullName?: string;
  coverFilePath?: string;
  passingThresholdPercent?: number;
  deadlineDays?: number;
  lessonsFreeOrder?: boolean;
  allowContinueAfterFail?: boolean;
  blockAfterDeadline?: boolean;
  keepAccessAfterDeadline?: boolean;
  includeInOverallStats?: boolean;
  sectionId?: number;
  sectionTitle?: string;
  sectionPriority?: number;
};
export type LearnerPracticeQuestionDto = {
  index?: number;
  questionType?:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "MATCHING"
    | "ORDERING"
    | "OPEN_ANSWER";
  questionText?: string;
  options?: string[];
  fullPoints?: number;
  partialPoints?: number;
};
export type LearnerLessonDto = {
  id?: number;
  position?: number;
  title?: string;
  description?: string;
  lessonType?:
    | "THEORY_TEXT"
    | "THEORY_VIDEO"
    | "THEORY_PDF"
    | "PRACTICE_TEST"
    | "PRACTICE_OPEN_ANSWER";
  theoryContentType?: "HTML_TEXT" | "VIDEO_URL" | "PDF_FILE";
  theoryContent?: string;
  questions?: LearnerPracticeQuestionDto[];
};
export type LearnerLessonSummaryDto = {
  id?: number;
  position?: number;
  title?: string;
  lessonType?:
    | "THEORY_TEXT"
    | "THEORY_VIDEO"
    | "THEORY_PDF"
    | "PRACTICE_TEST"
    | "PRACTICE_OPEN_ANSWER";
};
export type CourseLearnerDto = {
  id?: number;
  title?: string;
  description?: string;
  coverFilePath?: string;
  deadlineDays?: number;
  lessons?: LearnerLessonSummaryDto[];
};
export const {
  useUpdateMyLastVisitMutation,
  useSubmitPracticeMutation,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
  useMyStatsQuery,
  useMyProgramsQuery,
  useMyProgramQuery,
  useMyCoursesQuery,
  useGetLessonForLearnerQuery,
  useCourseForLearnerQuery,
} = injectedRtkApi;
