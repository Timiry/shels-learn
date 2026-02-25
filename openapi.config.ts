module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/entities/user/model/usersApi.ts",
  exportName: "usersApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  // tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: [/User/i, /user/i], // Фильтрация эндпоинтов
  // endpointOverrides: [...] // Кастомизация отдельных методов
};
