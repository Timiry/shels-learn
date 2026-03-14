module.exports = {
  schemaFile: "./api-docs.json", // Путь к вашему OpenAPI JSON
  apiFile: "./src/shared/api/baseApi.ts",
  apiImport: "baseApi",
  outputFile: "./src/entities/section/model/sectionsApi.ts",
  exportName: "sectionsApi",
  hooks: true, // Генерировать хуки (useGetUserQuery и т.д.)
  tag: true, // Автоматические теги для кэширования
  flattenArg: true, // Упростить аргументы запросов
  // Дополнительно:
  filterEndpoints: ["getById", "update", "delete", "getAll", "create"], // Фильтрация эндпоинтов
  // endpointOverrides: [...] // Кастомизация отдельных методов
};
