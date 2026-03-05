import { baseApi as api } from "../../../shared/api/baseApi";
import {
  CourseAdminDetailsDto,
  CourseDto,
  UpdateCourseApiArg,
  ApiResponse,
  LessonDto,
  UpdateTheoryLessonApiArg,
  UpdatePracticeLessonApiArg,
  CourseSummaryDto,
  CreateCourseRequest,
  AssignReviewerApiArg,
  CreateTheoryLessonApiArg,
  CreatePracticeLessonApiArg,
  UserInNotInListsDto,
  AssignStudentApiArg,
  GetLessonApiArg,
  DeleteLessonApiArg,
} from "./types";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourse: build.query<CourseAdminDetailsDto, number>({
      query: (queryArg) => ({ url: `/api/v1/admin/courses/${queryArg}` }),
    }),
    updateCourse: build.mutation<CourseDto, UpdateCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}`,
        method: "PUT",
        body: queryArg.createCourseRequest,
      }),
    }),
    deleteCourse: build.mutation<ApiResponse, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}`,
        method: "DELETE",
      }),
    }),
    updateTheoryLesson: build.mutation<LessonDto, UpdateTheoryLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}/theory`,
        method: "PUT",
        body: queryArg.updateTheoryLessonRequest,
      }),
    }),
    updatePracticeLesson: build.mutation<LessonDto, UpdatePracticeLessonApiArg>(
      {
        query: (queryArg) => ({
          url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}/practice`,
          method: "PUT",
          body: queryArg.updatePracticeLessonRequest,
        }),
      }
    ),

    getAllCourses: build.query<CourseSummaryDto[], void>({
      query: () => ({ url: `/api/v1/admin/courses` }),
    }),
    createCourse: build.mutation<CourseDto, CreateCourseRequest>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses`,
        method: "POST",
        body: queryArg,
      }),
    }),
    getCourseReviewers: build.query<ApiResponse, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}/reviewers`,
      }),
    }),
    assignReviewer: build.mutation<ApiResponse, AssignReviewerApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/reviewers`,
        method: "POST",
        body: queryArg.userInNotInRequest,
      }),
    }),
    createTheoryLesson: build.mutation<LessonDto, CreateTheoryLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/theory`,
        method: "POST",
        body: queryArg.createTheoryLessonRequest,
      }),
    }),
    createPracticeLesson: build.mutation<LessonDto, CreatePracticeLessonApiArg>(
      {
        query: (queryArg) => ({
          url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/practice`,
          method: "POST",
          body: queryArg.createPracticeLessonRequest,
        }),
      }
    ),
    getEnrollmentLists: build.query<UserInNotInListsDto, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}/enrollments`,
      }),
    }),
    assignStudent: build.mutation<ApiResponse, AssignStudentApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/enrollments`,
        method: "POST",
        body: queryArg.userInNotInRequest,
      }),
    }),
    getLesson: build.query<LessonDto, GetLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}`,
      }),
    }),
    deleteLesson: build.mutation<ApiResponse, DeleteLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as coursesApi };

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
  useGetEnrollmentListsQuery,
  useAssignStudentMutation,
  useGetLessonQuery,
  useDeleteLessonMutation,
} = injectedRtkApi;
