import { baseApi as api } from "../../../shared/api/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getSectionById: build.query<GetByIdApiResponse, GetByIdApiArg>({
      query: (queryArg) => ({ url: `/api/v1/admin/sections/${queryArg}` }),
      providesTags: ["Sections"],
    }),
    updateSection: build.mutation<UpdateApiResponse, UpdateApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/sections/${queryArg.sectionId}`,
        method: "PUT",
        body: queryArg.updateSectionRequest,
      }),
      invalidatesTags: ["Sections"],
    }),
    getAllSections: build.query<GetAllApiResponse, GetAllApiArg>({
      query: () => ({ url: `/api/v1/admin/sections` }),
      providesTags: ["Sections"],
    }),
    createSection: build.mutation<CreateApiResponse, CreateApiArg>({
      query: (queryArg) => ({
        url: `/api/v1/admin/sections`,
        method: "POST",
        body: queryArg,
      }),
      invalidatesTags: ["Sections"],
    }),
    deleteSection: build.mutation<ApiResponse, number>({
      query: (queryArg) => ({
        url: `/api/v1/admin/sections/${queryArg}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sections"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as sectionsApi };
export type GetByIdApiResponse = /** status 200 Раздел найден */ SectionDto;
export type GetByIdApiArg = number;
export type UpdateApiResponse = /** status 200 Раздел обновлен */ SectionDto;
export type UpdateApiArg = {
  sectionId: number;
  updateSectionRequest: UpdateSectionRequest;
};
export type GetAllApiResponse = /** status 200 Список разделов */ SectionDto[];
export type GetAllApiArg = void;
export type CreateApiResponse = /** status 201 Раздел создан */ SectionDto;
export type CreateApiArg = CreateSectionRequest;
export type SectionDto = {
  id: number;
  title: string;
  description?: string;
  priority?: number;
};
export type ApiResponse = {
  message?: string;
};
export type UpdateSectionRequest = {
  title: string;
  description?: string;
  priority: number;
};
export type CreateSectionRequest = {
  title: string;
  description?: string;
  priority: number;
};
export const {
  useGetSectionByIdQuery,
  useUpdateSectionMutation,
  useGetAllSectionsQuery,
  useCreateSectionMutation,
  useDeleteSectionMutation,
} = injectedRtkApi;
