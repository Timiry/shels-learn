import { UserDto } from "@/entities/user/model/usersApi";
import { baseApi as api } from "../../../shared/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourse: build.query<GetCourseApiResponse, GetCourseApiArg>({
      query: (queryArg) => ({ url: `/api/v1/admin/courses/${queryArg}` }),
      providesTags: ["Course"],
    }),
    updateCourse: build.mutation<UpdateCourseApiResponse, UpdateCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}`,
        method: "PUT",
        body: queryArg.createCourseRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: build.mutation<DeleteCourseApiResponse, DeleteCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course", "Learning", "Sections"],
    }),
    updateTheoryLesson: build.mutation<
      UpdateTheoryLessonApiResponse,
      UpdateTheoryLessonApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}/theory`,
        method: "PUT",
        body: queryArg.updateTheoryLessonRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    updatePracticeLesson: build.mutation<
      UpdatePracticeLessonApiResponse,
      UpdatePracticeLessonApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}/practice`,
        method: "PUT",
        body: queryArg.updatePracticeLessonRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    getAllCourses: build.query<GetAllCoursesApiResponse, GetAllCoursesApiArg>({
      query: () => ({ url: `/api/v1/admin/courses` }),
      providesTags: ["Course", "Sections"],
    }),
    createCourse: build.mutation<CreateCourseApiResponse, CreateCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Course", "Sections"],
    }),
    getCourseReviewers: build.query<
      GetCourseReviewersApiResponse,
      GetCourseReviewersApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}/reviewers`,
      }),
      providesTags: ["Course"],
    }),
    assignReviewer: build.mutation<
      AssignReviewerApiResponse,
      AssignReviewerApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/reviewers`,
        method: "POST",
        body: queryArg.userInNotInRequest,
      }),
      invalidatesTags: ["Course", "Review"],
    }),
    createTheoryLesson: build.mutation<
      CreateTheoryLessonApiResponse,
      CreateTheoryLessonApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/theory`,
        method: "POST",
        body: queryArg.createTheoryLessonRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    createPracticeLesson: build.mutation<
      CreatePracticeLessonApiResponse,
      CreatePracticeLessonApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/practice`,
        method: "POST",
        body: queryArg.createPracticeLessonRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    assignGroupToCourse: build.mutation<
      AssignGroupToCourseApiResponse,
      AssignGroupToCourseApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/groups/assign`,
        method: "POST",
        body: queryArg.uuidIdsRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    unassignGroupFromCourse: build.mutation<
      UnassignGroupFromCourseApiResponse,
      UnassignGroupFromCourseApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/groups/assign`,
        method: "DELETE",
        body: queryArg.uuidIdsRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    getEnrollmentLists: build.query<
      GetEnrollmentListsApiResponse,
      GetEnrollmentListsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}/enrollments`,
      }),
      providesTags: ["Course"],
    }),
    assignStudent: build.mutation<
      AssignStudentApiResponse,
      AssignStudentApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/enrollments`,
        method: "POST",
        body: queryArg.userInNotInRequest,
      }),
      invalidatesTags: ["Course", "Learning"],
    }),
    getLesson: build.query<GetLessonApiResponse, GetLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}`,
      }),
      providesTags: ["Course"],
    }),
    deleteLesson: build.mutation<DeleteLessonApiResponse, DeleteLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as coursesApi };

export type LessonType =
  | "THEORY_TEXT"
  | "THEORY_VIDEO"
  | "THEORY_PDF"
  | "PRACTICE_TEST"
  | "PRACTICE_OPEN_ANSWER";

export type PracticeQuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "MATCHING"
  | "ORDERING"
  | "OPEN_ANSWER";

export type GetCourseApiResponse =
  /** status 200 Детали курса */ CourseAdminDetailsDto;
export type GetCourseApiArg = number;
export type UpdateCourseApiResponse = /** status 200 Курс обновлён */ CourseDto;
export type UpdateCourseApiArg = {
  courseId: number;
  createCourseRequest: CreateCourseRequest;
};
export type DeleteCourseApiResponse = /** status 200 Курс удалён */ ApiResponse;
export type DeleteCourseApiArg = number;
export type UpdateTheoryLessonApiResponse =
  /** status 200 Теоретический урок обновлён */ LessonDto;
export type UpdateTheoryLessonApiArg = {
  courseId: number;
  lessonId: number;
  updateTheoryLessonRequest: UpdateTheoryLessonRequest;
};
export type UpdatePracticeLessonApiResponse =
  /** status 200 Практический урок обновлён */ LessonDto;
export type UpdatePracticeLessonApiArg = {
  courseId: number;
  lessonId: number;
  updatePracticeLessonRequest: UpdatePracticeLessonRequest;
};
export type GetAllCoursesApiResponse =
  /** status 200 Каталог курсов */ SectionWithCoursesDto[];
export type GetAllCoursesApiArg = void;
export type CreateCourseApiResponse = /** status 201 Курс создан */ CourseDto;
export type CreateCourseApiArg = CreateCourseRequest;
export type GetCourseReviewersApiResponse =
  /** status 200 ОК */ UserInNotInListsDto;
export type GetCourseReviewersApiArg = number;
export type AssignReviewerApiResponse =
  /** status 200 Проверяющие назначены */ ApiResponse;
export type AssignReviewerApiArg = {
  courseId: number;
  userInNotInRequest: UserInNotInRequest;
};
export type CreateTheoryLessonApiResponse =
  /** status 201 Теоретический урок создан */ LessonDto;
export type CreateTheoryLessonApiArg = {
  courseId: number;
  createTheoryLessonRequest: CreateTheoryLessonRequest;
};
export type CreatePracticeLessonApiResponse =
  /** status 201 Практический урок создан */ LessonDto;
export type CreatePracticeLessonApiArg = {
  courseId: number;
  createPracticeLessonRequest: CreatePracticeLessonRequest;
};
export type AssignGroupToCourseApiResponse =
  /** status 200 Группы назначены на курс */ ApiResponse;
export type AssignGroupToCourseApiArg = {
  courseId: number;
  uuidIdsRequest: UuidIdsRequest;
};
export type UnassignGroupFromCourseApiResponse =
  /** status 200 Назначение групп снято */ ApiResponse;
export type UnassignGroupFromCourseApiArg = {
  courseId: number;
  uuidIdsRequest: UuidIdsRequest;
};
export type GetEnrollmentListsApiResponse =
  /** status 200 Списки зачисленных и доступных пользователей */ UserInNotInListsDto;
export type GetEnrollmentListsApiArg = number;
export type AssignStudentApiResponse =
  /** status 200 Зачисления обновлены */ ApiResponse;
export type AssignStudentApiArg = {
  courseId: number;
  userInNotInRequest: UserInNotInRequest;
};
export type GetLessonApiResponse = /** status 200 Урок найден */ LessonDto;
export type GetLessonApiArg = {
  courseId: number;
  lessonId: number;
};
export type DeleteLessonApiResponse = /** status 200 Урок удалён */ ApiResponse;
export type DeleteLessonApiArg = {
  courseId: number;
  lessonId: number;
};
export type CourseDto = {
  id: number;
  title: string;
  description?: string;
  authorFullName?: string;
  coverFilePath?: string;
  deadlineDays?: number;
  lessonsFreeOrder?: boolean;
  sectionId?: number;
  sectionTitle?: string;
  sectionPriority?: number;
};
export type PracticeQuestionDto = {
  id: number;
  position?: number;
  questionType: PracticeQuestionType;
  questionText: string;
  trainerHint?: string;
  options?: string[];
  correctAnswers?: string[];
  fullPoints?: number;
  partialPoints?: number;
};
export type LessonDto = {
  id: number;
  courseId: number;
  position?: number;
  title?: string;
  description?: string;
  stopLesson?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  lessonType: LessonType;
  theoryContent?: string;
  fullPoints: number;
  passingThresholdPercent?: number;
  shuffleOnEveryAttempt?: boolean;
  showCorrectAnswersAfterCompletion?: boolean;
  questions?: PracticeQuestionDto[];
};
export type CourseAdminDetailsDto = {
  course?: CourseDto;
  lessons?: LessonDto[];
};
export type ApiResponse = {
  message?: string;
};
export type CreateCourseRequest = {
  title: string;
  description?: string;
  authorFullName?: string;
  coverFilePath?: string;
  deadlineDays?: number;
  lessonsFreeOrder?: boolean;
  sectionId?: number;
  lessonIdToPosition?: {
    [key: string]: number;
  };
};
export type UpdateTheoryLessonRequest = {
  position?: number;
  title?: string;
  description?: string;
  coverFilePath?: string;
  requiresPreviousCompleted?: boolean;
  openForAccess?: boolean;
  stopLesson?: boolean;
  blockedDuringAttempt?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  lessonType?: LessonType;
  content?: string;
  fullPoints?: number;
};
export type PracticeQuestionRequest = {
  id?: number;
  position: number;
  questionType?: PracticeQuestionType;
  questionText: string;
  trainerHint?: string;
  options?: string[];
  correctAnswers?: string[];
  fullPoints?: number;
  partialPoints?: number;
};
export type UpdatePracticeLessonRequest = {
  position?: number;
  title?: string;
  description?: string;
  stopLesson?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  lessonType?: LessonType;
  fullPoints?: number;
  passingThresholdPercent?: number;
  shuffleOptions?: boolean;
  showQuestionStatus?: boolean;
  showCorrectAnswers?: boolean;
  questions?: PracticeQuestionRequest[];
};
export type CourseSummaryDto = {
  id: number;
  title: string;
  description?: string;
  coverFilePath?: string;
  sectionId?: number;
  sectionTitle?: string;
  sectionPriority?: number;
  theoryLessonsCount?: number;
  practiceLessonsCount?: number;
};
export type SectionWithCoursesDto = {
  id: number;
  title: string;
  description?: string;
  priority?: number;
  courses?: CourseSummaryDto[];
};
export type UserInNotInRequest = {
  idsIn?: number[];
  idsNotIn?: number[];
};
export type CreateTheoryLessonRequest = {
  title: string;
  description?: string;
  stopLesson?: boolean;
  timeLimitMinutes?: number;
  lessonType: LessonType;
  content: string;
  fullPoints: number;
  questionIdToPosition?: {
    [key: string]: number;
  };
};
export type CreatePracticeLessonRequest = {
  title: string;
  description?: string;
  stopLesson?: boolean;
  attemptLimit?: number;
  timeLimitMinutes?: number;
  lessonType: LessonType;
  passingThresholdPercent?: number;
  shuffleOptions?: boolean;
  showQuestionStatus?: boolean;
  showCorrectAnswersAfterCompletion?: boolean;
  questions: PracticeQuestionRequest[];
};
export type UuidIdsRequest = {
  ids: string[];
};
export type UserInNotInListsDto = {
  in?: UserDto[];
  notIn?: UserDto[];
};
export const {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateTheoryLessonMutation,
  useUpdatePracticeLessonMutation,
  useGetAllCoursesQuery,
  useCreateCourseMutation,
  useGetCourseReviewersQuery,
  useAssignReviewerMutation,
  useCreateTheoryLessonMutation,
  useCreatePracticeLessonMutation,
  useAssignGroupToCourseMutation,
  useUnassignGroupFromCourseMutation,
  useGetEnrollmentListsQuery,
  useAssignStudentMutation,
  useGetLessonQuery,
  useDeleteLessonMutation,
} = injectedRtkApi;
