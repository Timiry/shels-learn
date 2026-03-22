import { UserDto } from "@/entities/user/model/usersApi";
import { baseApi as api } from "../../../shared/api/baseApi";
import { ProgramDto } from "@/features/programs/model/programsApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateMyLastVisit: build.mutation<
      UpdateMyLastVisitApiResponse,
      UpdateMyLastVisitApiArg
    >({
      query: () => ({ url: `/api/v1/student/my/last-visit`, method: "POST" }),
      invalidatesTags: ["Learning"],
    }),
    startLearningLesson: build.mutation<SubmissionResultDto, number>({
      query: (queryArg) => ({
        url: `/api/v1/student/lessons/${queryArg}/start`,
        method: "POST",
      }),
      invalidatesTags: ["Learning"],
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
      invalidatesTags: ["Learning"],
    }),
    completeTheoryLesson: build.mutation<
      CompleteTheoryLessonApiResponse,
      CompleteTheoryLessonApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/student/lessons/${queryArg}/complete-theory`,
        method: "POST",
      }),
      invalidatesTags: ["Learning"],
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
      providesTags: ["Learning", "Review"],
    }),
    myPrograms: build.query<MyProgramsApiResponse, MyProgramsApiArg>({
      query: () => ({ url: `/api/v1/student/my/programs` }),
      providesTags: ["Learning"],
    }),
    myProgram: build.query<MyProgramApiResponse, MyProgramApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/student/my/programs/${queryArg}`,
      }),
      providesTags: ["Learning"],
    }),
    myCourses: build.query<MyCoursesApiResponse, MyCoursesApiArg>({
      query: () => ({ url: `/api/v1/student/my/courses` }),
      providesTags: ["Learning", "Review", "Course"],
    }),
    getLessonForLearner: build.query<
      GetLessonForLearnerApiResponse,
      GetLessonForLearnerApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/student/lessons/${queryArg}` }),
      providesTags: ["Learning", "Review", "Course"],
    }),
    courseForLearner: build.query<
      CourseForLearnerApiResponse,
      CourseForLearnerApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/student/courses/${queryArg}` }),
      providesTags: ["Learning", "Review", "Course"],
    }),
    nextLessonForLearner: build.query<
      NextLessonForLearnerApiResponse,
      NextLessonForLearnerApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/student/courses/${queryArg}/lessons/next`,
      }),
      providesTags: ["Learning"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as studentApi };
export type UpdateMyLastVisitApiResponse =
  /** status 200 Дата последнего визита обновлена */ UserDto;
export type UpdateMyLastVisitApiArg = void;
export type SubmitPracticeApiResponse =
  /** status 200 Ответы отправлены */ SubmissionResultDto;
export type SubmitPracticeApiArg = {
  lessonId: number;
  practiceSubmissionRequest: PracticeSubmissionRequest;
};
export type CompleteTheoryLessonApiResponse =
  /** status 200 Теоретический урок отмечен как пройденный */ SubmissionResultDto;
export type CompleteTheoryLessonApiArg = number;
export type MyProfileApiResponse =
  /** status 200 Профиль текущего пользователя */ UserDto;
export type MyProfileApiArg = void;
export type UpdateMyProfileApiResponse =
  /** status 200 Профиль обновлён */ UserDto;
export type UpdateMyProfileApiArg = UpdateUserRequest;
export type MyStatsApiResponse =
  /** status 200 Личная статистика */ StudentCourseStatDto[];
export type MyStatsApiArg = void;
export type MyProgramsApiResponse =
  /** status 200 Список программ пользователя */ ProgramDto[];
export type MyProgramsApiArg = void;
export type MyProgramApiResponse =
  /** status 200 Программа пользователя */ ProgramDto;
export type MyProgramApiArg = number;
export type MyCoursesApiResponse =
  /** status 200 Список назначенных курсов */ CourseLearnerDto[];
export type MyCoursesApiArg = void;
export type GetLessonForLearnerApiResponse =
  /** status 200 Урок для прохождения */ LearnerLessonDto;
export type GetLessonForLearnerApiArg = number;
export type CourseForLearnerApiResponse =
  /** status 200 Детали курса */ CourseLearnerDto;
export type CourseForLearnerApiArg = number;
export type NextLessonForLearnerApiResponse =
  /** status 200 Следующий доступный урок */ LearnerLessonDto;
export type NextLessonForLearnerApiArg = number;
export type GroupDto = {
  id?: string;
  title?: string;
  type?: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};

export type ApiResponse = {
  message?: string;
};
export type SubmissionResultDto = {
  submissionId?: number;
  status?:
    | "COMPLETED"
    | "INCOMPLETED"
    | "PENDING_REVIEW"
    | "REWORKING"
    | "STARTED";
};
export type PracticeSubmissionRequest = {
  /** Ответы по id вопросов: questionId -> answers[] */
  questionAnswers?: {
    [key: string]: string[];
  };
  /** Время отправки ответа на практику в UTC */
  submittedAt?: number;
};

export type UpdateUserRequest = {
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  avatarFilePath?: string;
  phone?: string;
  snils: string;
  comment?: string;
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

export type AccessCondition =
  | "PREVIOUS_COURSES_COMPLETED"
  | "PREVIOUS_COURSES_VIEWED_OR_PENDING"
  | "ALL_OPEN";

export type CourseProgressStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "INCOMPLETED";

export type CourseProgressDto = {
  deadlineAt?: number;
  completionPercent?: number;
  completedLessons?: number;
  remainingLessons?: number;
  completionStatus?: CourseProgressStatus;
};

export type LessonProgressStatus =
  | "COMPLETED"
  | "INCOMPLETED"
  | "PENDING_REVIEW"
  | "REWORKING"
  | "STARTED";

export type LessonProgressDto = {
  status?: LessonProgressStatus;
  pointsAwarded?: number;
};
export type LearnerLessonSummaryDto = {
  id: number;
  position: number;
  title: string;
  lessonType:
    | "THEORY_TEXT"
    | "THEORY_VIDEO"
    | "THEORY_PDF"
    | "PRACTICE_TEST"
    | "PRACTICE_OPEN_ANSWER";
  blocked?: boolean;
  blockReason?: string;
  fullPoints?: number;
  lessonProgress?: LessonProgressDto;
};
export type CourseLearnerDto = {
  id: number;
  title?: string;
  description?: string;
  coverFilePath?: string;
  deadlineDays?: number;
  totalLessons?: number;
  progress?: CourseProgressDto;
  lessons?: LearnerLessonSummaryDto[];
};

export type QuestionProgressStatus =
  | "PENDING_REVIEW"
  | "ACCEPTED"
  | "REWORK"
  | "REJECTED";

export type LearnerPracticeQuestionDto = {
  id: number;
  position: number;
  questionType?:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "ORDERING"
    | "OPEN_ANSWER";
  questionText?: string;
  options?: string[];
  userAnswers?: string[];
  correctAnswers?: string[];
  status?: QuestionProgressStatus;
  reviewComment?: string;
  awardedPoints?: number;
  fullPoints?: number;
  partialPoints?: number;
};
export type LearnerLessonDto = {
  id: number;
  position?: number;
  title?: string;
  description?: string;
  lessonType?:
    | "THEORY_TEXT"
    | "THEORY_VIDEO"
    | "THEORY_PDF"
    | "PRACTICE_TEST"
    | "PRACTICE_OPEN_ANSWER";
  theoryContent?: string;
  deadlineAt?: number;
  timeLimitMinutes?: number;
  status?: LessonProgressStatus;
  attempts?: number;
  maxAttempts?: number;
  questions?: LearnerPracticeQuestionDto[];
};
export const {
  useUpdateMyLastVisitMutation,
  useStartLearningLessonMutation,
  useSubmitPracticeMutation,
  useCompleteTheoryLessonMutation,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
  useMyStatsQuery,
  useMyProgramsQuery,
  useMyProgramQuery,
  useMyCoursesQuery,
  useGetLessonForLearnerQuery,
  useCourseForLearnerQuery,
  useNextLessonForLearnerQuery,
} = injectedRtkApi;
