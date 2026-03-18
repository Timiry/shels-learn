module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/entities/course/model/api.ts",
  exportName: "coursesApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "getCourse",
    "updateCourse",
    "deleteCourse",
    "updateTheoryLesson",
    "updatePracticeLesson",
    "getAllCourses",
    "createCourse",
    "getCourseReviewers",
    "assignReviewer",
    "createTheoryLesson",
    "createPracticeLesson",
    "assignGroupToCourse",
    "unassignGroupFromCourse",
    "getEnrollmentLists",
    "assignStudent",
    "getLesson",
    "deleteLesson",
  ], // Фильтрация эндпоинтов
};
