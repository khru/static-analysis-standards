import js from "@eslint/js";
import standards from "./src/index.js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "coverage/**", "reports/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { standards },
    ...standards.configs.recommended,
  },
  {
    plugins: { standards },
    ...standards.configs.architecture,
  },
  {
    files: ["src/rules/**/*.ts"],
    rules: {
      "standards/quality/no-magic-strings": "off",
      "standards/quality/no-magic-numbers": "off",
    },
  },
  {
    plugins: { standards },
    ...standards.configs.testing,
  },
  eslintConfigPrettier,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
);
