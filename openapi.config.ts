module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/features/groupsManagement/api/groupsApi.ts",
  exportName: "groupsApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "getGroupFullInfoById",
    "updateGroup",
    "deleteGroup",
    "groups",
    "createGroup",
    "getAvailableToAssignPrograms",
    "assignProgramsToGroup",
    "unassignProgramsFromGroup",
    "addUserToGroup",
    "removeUsersFromGroup",
    "getAvailableToAssignCourses",
    "assignCoursesToGroup",
    "unassignCoursesFromGroup",
    "getUsersWithoutGroup",
    "groupUsersByTitle",
    "getUserGroups",
  ], // Фильтрация эндпоинтов
};
