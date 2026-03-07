module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile:
    "./src/features/statisticsAndReports/api/statistiksAndReportsApi.ts",
  exportName: "statistiksAndReportsApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "reviewOpenAnswer",
    "pendingReviews",
    "reviewCourses",
    "summaryCsv",
    "courseSummaryCsv",
    "courseStats",
  ], // Фильтрация эндпоинтов
  // endpointOverrides: [...] // Кастомизация отдельных методов
};
