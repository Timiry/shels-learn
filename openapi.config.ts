module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/entities/user/model/api.ts",
  exportName: "usersApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "updateMyLastVisit",
    "submitPractice",
    "submitPractice_1",
    "completeTheoryLesson",
    "myProfile",
    "updateMyProfile",
    "myStats",
    "myPrograms",
    "myProgram",
    "myCourses",
    "getLessonForLearner",
    "courseForLearner",
    "nextLessonForLearner",
  ], // Фильтрация эндпоинтов
};
