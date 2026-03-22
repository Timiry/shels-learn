module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/features/programs/model/programsApi.ts",
  exportName: "programsApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "getProgram",
    "updateProgram",
    "deleteProgram",
    "getPrograms",
    "createProgram",
    "assignGroupsToProgram",
    "getProgramCourseLists",
    "updateProgramCourseLists",
    "getProgramEnrollmentLists",
    "assignUsersToProgram",
  ], // Фильтрация эндпоинтов
};
