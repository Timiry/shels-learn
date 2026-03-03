module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/shared/api/CoursesApi.ts",
  exportName: "coursesApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  // tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "getCourseReviewers",
    "assignReviewer",
    "unassignReviewer",
    "getEnrollmentLists",
    "assignStudent",
  ], // Фильтрация эндпоинтов
  // endpointOverrides: [...] // Кастомизация отдельных методов
};
