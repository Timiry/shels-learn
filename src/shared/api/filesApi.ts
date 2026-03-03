import { baseApi as api } from "./baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    upload: build.mutation<FileUploadResponse, UploadApiArg>({
      query: (queryArg) => {
        const formData = new FormData();
        formData.append("file", queryArg.file);
        return {
          url: `/api/v1/files/upload`,
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as filesApi };
export type UploadApiArg = {
  file: File;
};
export type FileUploadResponse = {
  path?: string;
};
export type ApiResponse = {
  message?: string;
};
export const { useUploadMutation } = injectedRtkApi;
