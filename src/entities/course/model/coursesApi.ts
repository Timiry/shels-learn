import { baseApi as api } from "../../../shared/api/baseApi";
import {
  CourseAdminDetailsDto,
  CourseDto,
  UpdateCourseApiArg,
  ApiResponse,
  LessonDto,
  UpdateTheoryLessonApiArg,
  UpdatePracticeLessonApiArg,
  CreateCourseRequest,
  AssignReviewerApiArg,
  CreateTheoryLessonApiArg,
  CreatePracticeLessonApiArg,
  UserInNotInListsDto,
  AssignStudentApiArg,
  GetLessonApiArg,
  DeleteLessonApiArg,
  CourseSectionDto,
} from "./types";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCourse: build.query<CourseAdminDetailsDto, number>({
      query: (queryArg) => ({ url: `/api/v1/admin/courses/${queryArg}` }),
      providesTags: ["Course"],
    }),
    updateCourse: build.mutation<CourseDto, UpdateCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}`,
        method: "PUT",
        body: queryArg.createCourseRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: build.mutation<ApiResponse, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
    updateTheoryLesson: build.mutation<LessonDto, UpdateTheoryLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}/theory`,
        method: "PUT",
        body: queryArg.updateTheoryLessonRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    updatePracticeLesson: build.mutation<LessonDto, UpdatePracticeLessonApiArg>(
      {
        query: (queryArg) => ({
          url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}/practice`,
          method: "PUT",
          body: queryArg.updatePracticeLessonRequest,
        }),
        invalidatesTags: ["Course"],
      }
    ),

    getAllCourses: build.query<CourseSectionDto[], void>({
      query: () => ({ url: `/api/v1/admin/courses` }),
      providesTags: ["Course", "Sections"],
    }),
    createCourse: build.mutation<CourseDto, CreateCourseRequest>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Course"],
    }),
    getCourseReviewers: build.query<UserInNotInListsDto, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}/reviewers`,
      }),
      providesTags: ["Course"],
    }),
    assignReviewers: build.mutation<ApiResponse, AssignReviewerApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/reviewers`,
        method: "POST",
        body: queryArg.userInNotInRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    createTheoryLesson: build.mutation<LessonDto, CreateTheoryLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/theory`,
        method: "POST",
        body: queryArg.createTheoryLessonRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    createPracticeLesson: build.mutation<LessonDto, CreatePracticeLessonApiArg>(
      {
        query: (queryArg) => ({
          url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/practice`,
          method: "POST",
          body: queryArg.createPracticeLessonRequest,
        }),
        invalidatesTags: ["Course"],
      }
    ),
    getEnrollmentLists: build.query<UserInNotInListsDto, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg}/enrollments`,
      }),
      providesTags: ["Course"],
    }),
    assignStudents: build.mutation<ApiResponse, AssignStudentApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/enrollments`,
        method: "POST",
        body: queryArg.userInNotInRequest,
      }),
      invalidatesTags: ["Course"],
    }),
    getLesson: build.query<LessonDto, GetLessonApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/${queryArg.courseId}/lessons/${queryArg.lessonId}`,
      }),
      providesTags: ["Course"],
    }),
    deleteLesson: build.mutation<ApiResponse, DeleteLessonApiArg>({
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

export const {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useUpdateTheoryLessonMutation,
  useUpdatePracticeLessonMutation,
  useGetAllCoursesQuery,
  useCreateCourseMutation,
  useGetCourseReviewersQuery,
  useAssignReviewersMutation,
  useCreateTheoryLessonMutation,
  useCreatePracticeLessonMutation,
  useGetEnrollmentListsQuery,
  useAssignStudentsMutation,
  useGetLessonQuery,
  useDeleteLessonMutation,
} = injectedRtkApi;
