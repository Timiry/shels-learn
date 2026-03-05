module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/features/auth/api/authApi.ts",
  exportName: "authApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  // tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [
    "setPassword",
    "recoverPassword",
    "login",
    "changePassword",
  ], // Фильтрация эндпоинтов
  // endpointOverrides: [...] // Кастомизация отдельных методов
};
