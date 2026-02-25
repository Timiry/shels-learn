import { baseApi as api } from "../../../shared/api/baseApi";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<GetUserApiResponse, GetUserApiArg>({
      query: (queryArg) => ({ url: `/api/v1/admin/users/${queryArg}` }),
    }),
    updateUser: build.mutation<UpdateUserApiResponse, UpdateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/${queryArg.userId}`,
        method: "PUT",
        body: queryArg.updateUserRequest,
      }),
    }),
    deleteUser: build.mutation<DeleteUserApiResponse, DeleteUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/${queryArg}`,
        method: "DELETE",
      }),
    }),
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: () => ({ url: `/api/v1/admin/users` }),
    }),
    createUser: build.mutation<CreateUserApiResponse, CreateUserApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users`,
        method: "POST",
        body: queryArg,
      }),
    }),
    deleteUsers: build.mutation<DeleteUsersApiResponse, DeleteUsersApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/users`,
        method: "DELETE",
        body: queryArg,
      }),
    }),
    setUserPasswordByAdmin: build.mutation<
      SetUserPasswordApiResponse,
      SetUserPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/${queryArg.userId}/password`,
        method: "POST",
        body: queryArg.setUserPasswordRequest,
      }),
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
    }),
    updateUserRole: build.mutation<
      UpdateUserRoleApiResponse,
      UpdateUserRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v1/admin/users/${queryArg.userId}/role`,
        method: "PATCH",
        body: queryArg.updateUserRoleRequest,
      }),
    }),
    exportUsersCsv: build.query<
      ExportUsersCsvApiResponse,
      ExportUsersCsvApiArg
    >({
      query: () => ({ url: `/api/v1/admin/users/export` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as usersApi };
export type GetUserApiResponse = /** status 200 OK */ UserDto;
export type GetUserApiArg = number;
export type UpdateUserApiResponse = /** status 200 OK */ UserDto;
export type UpdateUserApiArg = {
  userId: number;
  updateUserRequest: UpdateUserRequest;
};
export type DeleteUserApiResponse = /** status 200 OK */ ApiResponse;
export type DeleteUserApiArg = number;
export type GetUsersApiResponse = /** status 200 OK */ UserDto[];
export type GetUsersApiArg = void;
export type CreateUserApiResponse = /** status 200 OK */ UserDto;
export type CreateUserApiArg = CreateUserRequest;
export type DeleteUsersApiResponse = /** status 200 OK */ ApiResponse;
export type DeleteUsersApiArg = IdsRequest;
export type SetUserPasswordApiResponse = /** status 200 OK */ ApiResponse;
export type SetUserPasswordApiArg = {
  userId: number;
  setUserPasswordRequest: SetUserPasswordRequest;
};
export type ImportUsersCsvApiResponse = /** status 200 OK */ ApiResponse;
export type ImportUsersCsvApiArg = {
  file: Blob;
};
export type SetUsersActivationApiResponse = /** status 200 OK */ ApiResponse;
export type SetUsersActivationApiArg = ActivationRequest;
export type AddUserToGroupApiResponse = /** status 200 OK */ ApiResponse;
export type AddUserToGroupApiArg = {
  groupId: string;
  groupUsersRequest: GroupUsersRequest;
};
export type RemoveUsersFromGroupApiResponse = /** status 200 OK */ ApiResponse;
export type RemoveUsersFromGroupApiArg = {
  groupId: string;
  groupUsersRequest: GroupUsersRequest;
};
export type AssignUsersToProgramApiResponse = /** status 200 OK */ ApiResponse;
export type AssignUsersToProgramApiArg = {
  programId: number;
  idsRequest: IdsRequest;
};
export type UpdateUserRoleApiResponse = /** status 200 OK */ UserDto;
export type UpdateUserRoleApiArg = {
  userId: number;
  updateUserRoleRequest: UpdateUserRoleRequest;
};

export type MyGroupsUsersByTitleApiArg = string | undefined;
export type ExportUsersCsvApiResponse = unknown;
export type ExportUsersCsvApiArg = void;
export type GroupUsersById1ApiArg = string;
export type GroupUsersByTitleApiArg = string | undefined;
export type UserDto = {
  id: number;
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  enabled: boolean;
  phone?: string;
  comment?: string;
  createdAt?: string;
  createdBy?: string;
  lastVisit?: string;
  deactivatedAt?: string;
  deactivatedBy?: string;
};
export type UpdateUserRequest = {
  fullName: string;
  email: string;
  role: "ADMIN" | "STUDENT";
  phone?: string;
  comment?: string;
};
export type ApiResponse = {
  message?: string;
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
};
export type IdsRequest = {
  ids: number[];
};
export type SetUserPasswordRequest = {
  password: string;
};
export type ActivationRequest = {
  activate?: boolean;
  userIds: number[];
};
export type GroupUsersRequest = {
  userIds: number[];
};
export type UpdateUserRoleRequest = {
  role: "ADMIN" | "STUDENT";
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
  useUpdateUserRoleMutation,
  useExportUsersCsvQuery,
  useSetUserPasswordByAdminMutation,
} = injectedRtkApi;
