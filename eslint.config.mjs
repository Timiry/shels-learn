import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react/configs/recommended.js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parserTs from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      "next-env.d.ts",
      "*.svg",
      "*.json",
    ],
  },

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: parserTs,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
  },

  {
    files: ["eslint.config.mjs", "prettier.config.js"],
    ...pluginTs.configs.disableTypeChecked,
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        project: false, // ← отключаем tsconfig для этого файла
      },
    },
  },

  // React (для совместимости с плагинами)
  pluginReact,

  // Правила
  {
    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "react/react-in-jsx-scope": "off",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "warn",

      // Отключаем правила, переопределённые Prettier
      "no-mixed-spaces-and-tabs": "off",
    },
  },
];

export default eslintConfig;
