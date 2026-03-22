import { baseApi as api } from "../../../shared/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<GetUserApiResponse, GetUserApiArg>({
      query: (queryArg) => ({ url: `/api/v1/admin/users/${queryArg}` }),
      providesTags: ["User"],
    }),
    updateUser: build.mutation<UpdateUserApiResponse, UpdateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/${queryArg.userId}`,
        method: "PUT",
        body: queryArg.updateUserRequest,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: build.mutation<DeleteUserApiResponse, DeleteUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: () => ({ url: `/api/v1/admin/users` }),
      providesTags: ["User"],
    }),
    createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUsers: build.mutation<DeleteUsersApiResponse, DeleteUsersApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users`,
        method: "DELETE",
        body: queryArg,
      }),
      invalidatesTags: ["User"],
    }),
    importUsersCsv: build.mutation<
      ImportUsersCsvApiResponse,
      ImportUsersCsvApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/import`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["User"],
    }),
    setUsersActivation: build.mutation<
      SetUsersActivationApiResponse,
      SetUsersActivationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/activation`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["User"],
    }),
    getUserStats: build.query<GetUserStatsApiResponse, GetUserStatsApiArg>({
      query: (queryArg) => ({ url: `/api/v1/admin/users/${queryArg}/stats` }),
      providesTags: ["User"],
    }),
    exportUsersCsv: build.query<
      ExportUsersCsvApiResponse,
      ExportUsersCsvApiArg
    >({
      query: () => ({ url: `/api/v1/admin/users/export` }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as usersApi };
export type GetUserApiResponse = /** status 200 Пользователь найден */ UserDto;
export type GetUserApiArg = number;
export type UpdateUserApiResponse =
  /** status 200 Пользователь обновлен */ UserDto;
export type UpdateUserApiArg = {
  userId: number;
  updateUserRequest: UpdateUserRequest;
};
export type DeleteUserApiResponse =
  /** status 200 Пользователь удален */ ApiResponse;
export type DeleteUserApiArg = number;
export type GetUsersApiResponse =
  /** status 200 Список пользователей */ UserDto[];
export type GetUsersApiArg = void;
export type CreateUserApiResponse =
  /** status 201 Пользователь создан */ UserDto;
export type CreateUserApiArg = CreateUserRequest;
export type DeleteUsersApiResponse =
  /** status 200 Пользователи удалены */ ApiResponse;
export type DeleteUsersApiArg = IdsRequest;
export type ImportUsersCsvApiResponse =
  /** status 200 Импорт выполнен */ ApiResponse;
export type ImportUsersCsvApiArg = {
  file: Blob;
};
export type SetUsersActivationApiResponse =
  /** status 200 Статусы активации обновлены */ ApiResponse;
export type SetUsersActivationApiArg = ActivationRequest;
export type GetUserStatsApiResponse =
  /** status 200 Статистика пользователя */ StudentCourseStatDto[];
export type GetUserStatsApiArg = number;
export type ExportUsersCsvApiResponse = unknown;
export type ExportUsersCsvApiArg = void;
export type GroupDto = {
  id?: string;
  title?: string;
  type?: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};
export type UserDto = {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  activation?: boolean;
  enabled?: boolean;
  phone?: string;
  snils: string;
  comment?: string;
  avatarFilePath?: string;
  createdAt?: number;
  createdBy?: string;
  lastVisit?: number;
  deactivatedAt?: number;
  deactivatedBy?: string;
  groups?: GroupDto[];
};
export type ApiResponse = {
  message?: string;
};
export type UpdateUserRequest = {
  fullName?: string;
  email?: string;
  role?: "ADMIN" | "STUDENT";
  avatarFilePath?: string;
  phone?: string;
  snils?: string;
  comment?: string;
  password?: string;
};
export type CreateUserRequest = {
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  avatarFilePath?: string;
  phone?: string;
  snils?: string;
  comment?: string;
  createdAt?: number;
  createdBy?: string;
  lastVisit?: number;
  deactivatedAt?: number;
  deactivatedBy?: string;
  password?: string;
  groupIds?: string[];
  courseIds?: number[];
};
export type IdsRequest = {
  ids: number[];
};
export type ActivationRequest = {
  activate?: boolean;
  userIds: number[];
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
export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUsersMutation,
  useImportUsersCsvMutation,
  useSetUsersActivationMutation,
  useGetUserStatsQuery,
  useExportUsersCsvQuery,
} = injectedRtkApi;
