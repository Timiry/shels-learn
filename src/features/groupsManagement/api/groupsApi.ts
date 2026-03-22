import { UserDto } from "@/entities/user/model/usersApi";
import { baseApi as api } from "../../../shared/api/baseApi";
import { CourseSummaryDto } from "@/entities/course/model/coursesApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGroupFullInfoById: build.query<
      GetGroupFullInfoByIdApiResponse,
      GetGroupFullInfoByIdApiArg
    >({
      query: (queryArg) => ({ url: `/api/v1/admin/groups/${queryArg}` }),
      providesTags: ["Groups"],
    }),
    updateGroup: build.mutation<UpdateGroupApiResponse, UpdateGroupApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}`,
        method: "PUT",
        body: queryArg.updateGroupRequest,
      }),
      invalidatesTags: ["Groups"],
    }),
    deleteGroup: build.mutation<DeleteGroupApiResponse, DeleteGroupApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),
    groups: build.query<GroupsApiResponse, GroupsApiArg>({
      query: () => ({ url: `/api/v1/admin/groups` }),
      providesTags: ["Groups"],
    }),
    createGroup: build.mutation<CreateGroupApiResponse, CreateGroupApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Groups"],
    }),
    getAvailableToAssignPrograms: build.query<
      GetAvailableToAssignProgramsApiResponse,
      GetAvailableToAssignProgramsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg}/programs/assign`,
      }),
      providesTags: ["Groups"],
    }),
    assignProgramsToGroup: build.mutation<
      AssignProgramsToGroupApiResponse,
      AssignProgramsToGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/programs/assign`,
        method: "POST",
        body: queryArg.idsRequest,
      }),
      invalidatesTags: ["Groups"],
    }),
    unassignProgramsFromGroup: build.mutation<
      UnassignProgramsFromGroupApiResponse,
      UnassignProgramsFromGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/programs/assign`,
        method: "DELETE",
        body: queryArg.idsRequest,
      }),
      invalidatesTags: ["Groups"],
    }),
    addUserToGroup: build.mutation<
      AddUserToGroupApiResponse,
      AddUserToGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/members`,
        method: "POST",
        body: queryArg.idsRequest,
      }),
      invalidatesTags: ["Groups", "Learning", "User", "AllUsers"],
    }),
    removeUsersFromGroup: build.mutation<
      RemoveUsersFromGroupApiResponse,
      RemoveUsersFromGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/members`,
        method: "DELETE",
        body: queryArg.idsRequest,
      }),
      invalidatesTags: ["Groups", "Learning", "User", "AllUsers"],
    }),
    getAvailableToAssignCourses: build.query<
      GetAvailableToAssignCoursesApiResponse,
      GetAvailableToAssignCoursesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg}/courses/assign`,
      }),
      providesTags: ["Groups"],
    }),
    assignCoursesToGroup: build.mutation<
      AssignCoursesToGroupApiResponse,
      AssignCoursesToGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/courses/assign`,
        method: "POST",
        body: queryArg.idsRequest,
      }),
      invalidatesTags: ["Groups"],
    }),
    unassignCoursesFromGroup: build.mutation<
      UnassignCoursesFromGroupApiResponse,
      UnassignCoursesFromGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg.groupId}/courses/assign`,
        method: "DELETE",
        body: queryArg.idsRequest,
      }),
      invalidatesTags: ["Groups"],
    }),
    getUsersWithoutGroup: build.query<
      GetUsersWithoutGroupApiResponse,
      GetUsersWithoutGroupApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/${queryArg}/users/availableToAssign`,
      }),
      providesTags: ["Groups"],
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
      providesTags: ["Groups"],
    }),
    getUserGroups: build.query<GetUserGroupsApiResponse, GetUserGroupsApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/groups/users/${queryArg}`,
      }),
      providesTags: ["Groups"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as groupsApi };
export type GetGroupFullInfoByIdApiResponse =
  /** status 200 Группа найдена */ GroupFullInfoDto;
export type GetGroupFullInfoByIdApiArg = string;
export type UpdateGroupApiResponse =
  /** status 200 Группа обновлена */ GroupDto;
export type UpdateGroupApiArg = {
  groupId: string;
  updateGroupRequest: UpdateGroupRequest;
};
export type DeleteGroupApiResponse =
  /** status 200 Группа удалена */ ApiResponse;
export type DeleteGroupApiArg = string;
export type GroupsApiResponse = /** status 200 Список групп */ GroupDto[];
export type GroupsApiArg = void;
export type CreateGroupApiResponse = /** status 201 Группа создана */ GroupDto;
export type CreateGroupApiArg = CreateGroupRequest;
export type GetAvailableToAssignProgramsApiResponse =
  /** status 200 Список программ */ ProgramSummaryDto[];
export type GetAvailableToAssignProgramsApiArg = string;
export type AssignProgramsToGroupApiResponse =
  /** status 200 Программы добавлены */ ApiResponse;
export type AssignProgramsToGroupApiArg = {
  groupId: string;
  idsRequest: IdsRequest;
};
export type UnassignProgramsFromGroupApiResponse =
  /** status 200 Пользователи удалены */ ApiResponse;
export type UnassignProgramsFromGroupApiArg = {
  groupId: string;
  idsRequest: IdsRequest;
};
export type AddUserToGroupApiResponse =
  /** status 200 Пользователи добавлены */ ApiResponse;
export type AddUserToGroupApiArg = {
  groupId: string;
  idsRequest: IdsRequest;
};
export type RemoveUsersFromGroupApiResponse =
  /** status 200 Пользователи удалены */ ApiResponse;
export type RemoveUsersFromGroupApiArg = {
  groupId: string;
  idsRequest: IdsRequest;
};
export type GetAvailableToAssignCoursesApiResponse =
  /** status 200 Список пользователей */ CourseSummaryDto[];
export type GetAvailableToAssignCoursesApiArg = string;
export type AssignCoursesToGroupApiResponse =
  /** status 200 Курсы добавлены */ ApiResponse;
export type AssignCoursesToGroupApiArg = {
  groupId: string;
  idsRequest: IdsRequest;
};
export type UnassignCoursesFromGroupApiResponse =
  /** status 200 Курсы удалены */ ApiResponse;
export type UnassignCoursesFromGroupApiArg = {
  groupId: string;
  idsRequest: IdsRequest;
};
export type GetUsersWithoutGroupApiResponse =
  /** status 200 Список пользователей */ UserDto[];
export type GetUsersWithoutGroupApiArg = string;
export type GroupUsersByTitleApiResponse =
  /** status 200 Результаты поиска */ GroupUsersDto[];
export type GroupUsersByTitleApiArg = string | undefined;
export type GetUserGroupsApiResponse =
  /** status 200 Список групп */ GroupDto[];
export type GetUserGroupsApiArg = number;
export type ApiResponse = {
  message?: string;
};

export type GroupType = "GENERAL" | "COMPANY" | "DEPARTMENT" | "POSITION";
export type GroupDto = {
  id: string;
  title: string;
  type: GroupType;
};

export type GroupFullInfoDto = {
  group: GroupDto;
  users?: UserDto[];
  courses?: CourseSummaryDto[];
  programs?: ProgramSummaryDto[];
};
export type UpdateGroupRequest = {
  title: string;
  type: GroupType;
};
export type CreateGroupRequest = {
  title: string;
  type: GroupType;
};
export type ProgramSummaryDto = {
  id: number;
  title: string;
  description?: string;
};
export type IdsRequest = {
  ids: number[];
};

export type GroupUsersDto = {
  id?: string;
  title?: string;
  type?: GroupType;
  users?: UserDto[];
};
export const {
  useGetGroupFullInfoByIdQuery,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useGroupsQuery,
  useCreateGroupMutation,
  useGetAvailableToAssignProgramsQuery,
  useAssignProgramsToGroupMutation,
  useUnassignProgramsFromGroupMutation,
  useAddUserToGroupMutation,
  useRemoveUsersFromGroupMutation,
  useGetAvailableToAssignCoursesQuery,
  useAssignCoursesToGroupMutation,
  useUnassignCoursesFromGroupMutation,
  useGetUsersWithoutGroupQuery,
  useGroupUsersByTitleQuery,
  useGetUserGroupsQuery,
} = injectedRtkApi;
