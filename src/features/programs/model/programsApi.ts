import { baseApi as api } from "../../../shared/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProgram: build.query<GetProgramApiResponse, GetProgramApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg}`,
      }),
      providesTags: ["Programs"],
    }),
    updateProgram: build.mutation<
      UpdateProgramApiResponse,
      UpdateProgramApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg.programId}`,
        method: "PUT",
        body: queryArg.createLearningProgramRequest,
      }),
      invalidatesTags: ["Programs"],
    }),
    deleteProgram: build.mutation<
      DeleteProgramApiResponse,
      DeleteProgramApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Programs"],
    }),
    getPrograms: build.query<GetProgramsApiResponse, GetProgramsApiArg>({
      query: () => ({ url: `/api/v1/admin/courses/programs` }),
      providesTags: ["Programs"],
    }),
    createProgram: build.mutation<
      CreateProgramApiResponse,
      CreateProgramApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Programs"],
    }),
    assignGroupsToProgram: build.mutation<
      AssignGroupsToProgramApiResponse,
      AssignGroupsToProgramApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg.programId}/groups/assign`,
        method: "POST",
        body: queryArg.programGroupAssignRequest,
      }),
      invalidatesTags: ["Programs"],
    }),
    getProgramCourseLists: build.query<
      GetProgramCourseListsApiResponse,
      GetProgramCourseListsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg}/courses/assign`,
      }),
      providesTags: ["Programs", "Course"],
    }),
    updateProgramCourseLists: build.mutation<
      UpdateProgramCourseListsApiResponse,
      UpdateProgramCourseListsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg.programId}/courses/assign`,
        method: "POST",
        body: queryArg.programCourseAssignRequest,
      }),
      invalidatesTags: ["Programs", "Learning"],
    }),
    getProgramEnrollmentLists: build.query<
      GetProgramEnrollmentListsApiResponse,
      GetProgramEnrollmentListsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg}/assign`,
      }),
      providesTags: ["Programs"],
    }),
    assignUsersToProgram: build.mutation<
      AssignUsersToProgramApiResponse,
      AssignUsersToProgramApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/courses/programs/${queryArg.programId}/assign`,
        method: "POST",
        body: queryArg.programUserAssignRequest,
      }),
      invalidatesTags: ["Programs", "Learning"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as programsApi };
export type GetProgramApiResponse =
  /** status 200 Программа найдена */ ProgramDto;
export type GetProgramApiArg = number;
export type UpdateProgramApiResponse =
  /** status 200 Программа обновлена */ ProgramDto;
export type UpdateProgramApiArg = {
  programId: number;
  createLearningProgramRequest: CreateLearningProgramRequest;
};
export type DeleteProgramApiResponse =
  /** status 200 Программа удалена */ ApiResponse;
export type DeleteProgramApiArg = number;
export type GetProgramsApiResponse =
  /** status 200 Список программ */ ProgramDto[];
export type GetProgramsApiArg = void;
export type CreateProgramApiResponse =
  /** status 201 Программа создана */ ProgramDto;
export type CreateProgramApiArg = CreateLearningProgramRequest;
export type AssignGroupsToProgramApiResponse =
  /** status 200 Назначения групп обновлены */ ApiResponse;
export type AssignGroupsToProgramApiArg = {
  programId: number;
  programGroupAssignRequest: ProgramGroupAssignRequest;
};
export type GetProgramCourseListsApiResponse =
  /** status 200 Списки курсов */ CourseInNotInListsDto;
export type GetProgramCourseListsApiArg = number;
export type UpdateProgramCourseListsApiResponse =
  /** status 200 Состав курсов программы обновлен */ ApiResponse;
export type UpdateProgramCourseListsApiArg = {
  programId: number;
  programCourseAssignRequest: ProgramCourseAssignRequest;
};
export type GetProgramEnrollmentListsApiResponse =
  /** status 200 Списки пользователей */ UserInNotInListsDto;
export type GetProgramEnrollmentListsApiArg = number;
export type AssignUsersToProgramApiResponse =
  /** status 200 Назначения пользователей обновлены */ ApiResponse;
export type AssignUsersToProgramApiArg = {
  programId: number;
  programUserAssignRequest: ProgramUserAssignRequest;
};
export type ProgramCourseDto = {
  courseId?: number;
  orderIndex?: number;
  available?: boolean;
  viewed?: boolean;
  completed?: boolean;
};
export type ProgramDto = {
  id?: number;
  title?: string;
  description?: string;
  accessCondition?:
    | "PREVIOUS_COURSES_COMPLETED"
    | "PREVIOUS_COURSES_VIEWED_OR_PENDING"
    | "ALL_OPEN";
  deadlineAt?: number;
  blockAfterDeadline?: boolean;
  completed?: boolean;
  courses?: ProgramCourseDto[];
};
export type ApiResponse = {
  message?: string;
};
export type CreateLearningProgramRequest = {
  title: string;
  description?: string;
  accessCondition?:
    | "PREVIOUS_COURSES_COMPLETED"
    | "PREVIOUS_COURSES_VIEWED_OR_PENDING"
    | "ALL_OPEN";
  deadlineAt?: number;
  blockAfterDeadline?: boolean;
};
export type ProgramGroupAssignRequest = {
  idsIn?: string[];
  idsNotIn?: string[];
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
export type CourseInNotInListsDto = {
  in?: CourseDto[];
  notIn?: CourseDto[];
};
export type ProgramCourseAssignRequest = {
  orderedCourseIds: number[];
};
export type GroupDto = {
  id?: string;
  title?: string;
  type?: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};
export type UserDto = {
  id?: number;
  fullName?: string;
  email?: string;
  role?: "ADMIN" | "STUDENT";
  activation?: boolean;
  enabled?: boolean;
  phone?: string;
  snils?: string;
  comment?: string;
  avatarFilePath?: string;
  createdAt?: number;
  createdBy?: string;
  lastVisit?: number;
  deactivatedAt?: number;
  deactivatedBy?: string;
  groups?: GroupDto[];
};
export type UserInNotInListsDto = {
  in?: UserDto[];
  notIn?: UserDto[];
};
export type ProgramUserAssignRequest = {
  idsIn?: number[];
  idsNotIn?: number[];
};
export const {
  useGetProgramQuery,
  useUpdateProgramMutation,
  useDeleteProgramMutation,
  useGetProgramsQuery,
  useCreateProgramMutation,
  useAssignGroupsToProgramMutation,
  useGetProgramCourseListsQuery,
  useUpdateProgramCourseListsMutation,
  useGetProgramEnrollmentListsQuery,
  useAssignUsersToProgramMutation,
} = injectedRtkApi;
