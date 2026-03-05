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
      invalidatesTags: ["AllUsers"],
    }),
    updateGroup: build.mutation<UpdateGroupApiResponse, UpdateGroupApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}`,
        method: "PUT",
        body: queryArg.updateGroupRequest,
      }),
    }),
    deleteGroup: build.mutation<DeleteGroupApiResponse, DeleteGroupApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg}`,
        method: "DELETE",
      }),
    }),
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: () => ({ url: `/api/v1/admin/users` }),
      providesTags: ["AllUsers"],
    }),
    createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["User", "AllUsers"],
    }),
    deleteUsers: build.mutation<DeleteUsersApiResponse, DeleteUsersApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users`,
        method: "DELETE",
        body: queryArg,
      }),
      invalidatesTags: ["AllUsers"],
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
      invalidatesTags: ["AllUsers"],
    }),
    groups: build.query<GroupsApiResponse, GroupsApiArg>({
      query: () => ({ url: `/api/v1/admin/groups` }),
    }),
    createGroup: build.mutation<CreateGroupApiResponse, CreateGroupApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups`,
        method: "POST",
        body: queryArg,
      }),
    }),
    addUserToGroup: build.mutation<
      AddUserToGroupApiResponse,
      AddUserToGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/members`,
        method: "POST",
        body: queryArg.groupUsersRequest,
      }),
    }),
    removeUsersFromGroup: build.mutation<
      RemoveUsersFromGroupApiResponse,
      RemoveUsersFromGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/members`,
        method: "DELETE",
        body: queryArg.groupUsersRequest,
      }),
    }),
    getUserStats: build.query<GetUserStatsApiResponse, GetUserStatsApiArg>({
      query: (queryArg) => ({ url: `/api/v1/admin/users/${queryArg}/stats` }),
    }),

    exportUsersCsv: build.query<
      ExportUsersCsvApiResponse,
      ExportUsersCsvApiArg
    >({
      query: () => ({ url: `/api/v1/admin/users/export` }),
    }),
    groupUsersById: build.query<
      GroupUsersByIdApiResponse,
      GroupUsersByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/admin/groups/${queryArg}/users` }),
    }),
    groupUsersByTitle: build.query<
      GroupUsersByTitleApiResponse,
      GroupUsersByTitleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/users`,
        params: {
          title: queryArg,
        },
      }),
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
export type UpdateGroupApiResponse =
  /** status 200 Группа обновлена */ GroupDto;
export type UpdateGroupApiArg = {
  groupId: string;
  updateGroupRequest: UpdateGroupRequest;
};
export type DeleteGroupApiResponse =
  /** status 200 Группа удалена */ ApiResponse;
export type DeleteGroupApiArg = string;
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
export type GroupsApiResponse = /** status 200 Список групп */ GroupDto;
export type GroupsApiArg = void;
export type CreateGroupApiResponse = /** status 201 Группа создана */ GroupDto;
export type CreateGroupApiArg = CreateGroupRequest;
export type AddUserToGroupApiResponse =
  /** status 200 Пользователи добавлены */ ApiResponse;
export type AddUserToGroupApiArg = {
  groupId: string;
  groupUsersRequest: GroupUsersRequest;
};
export type RemoveUsersFromGroupApiResponse =
  /** status 200 Пользователи удалены */ ApiResponse;
export type RemoveUsersFromGroupApiArg = {
  groupId: string;
  groupUsersRequest: GroupUsersRequest;
};
export type GetUserStatsApiResponse =
  /** status 200 Статистика пользователя */ StudentCourseStatDto[];
export type GetUserStatsApiArg = number;
export type ExportUsersCsvApiResponse = unknown;
export type ExportUsersCsvApiArg = void;
export type GroupUsersByIdApiResponse =
  /** status 200 Участники группы */ GroupUsersDto;
export type GroupUsersByIdApiArg = string;
export type GroupUsersByTitleApiResponse =
  /** status 200 Результаты поиска */ GroupUsersDto;
export type GroupUsersByTitleApiArg = string | undefined;
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
export type UpdateUserRequest = {
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  phone?: string;
  comment?: string;
  password?: string;
};
export type GroupDto = {
  id?: string;
  title?: string;
  type?: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};
export type UpdateGroupRequest = {
  title: string;
  type: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};
export type CreateUserRequest = {
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  phone?: string;
  comment?: string;
  createdAt?: string;
  createdBy?: string;
  lastVisit?: string;
  deactivatedAt?: string;
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
export type CreateGroupRequest = {
  title: string;
  type: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
};
export type GroupUsersRequest = {
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
export type GroupUsersDto = {
  id?: string;
  title?: string;
  type?: "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
  users?: UserDto[];
};
export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUsersMutation,
  useImportUsersCsvMutation,
  useSetUsersActivationMutation,
  useGroupsQuery,
  useCreateGroupMutation,
  useAddUserToGroupMutation,
  useRemoveUsersFromGroupMutation,
  useGetUserStatsQuery,
  useExportUsersCsvQuery,
  useGroupUsersByIdQuery,
  useGroupUsersByTitleQuery,
} = injectedRtkApi;
