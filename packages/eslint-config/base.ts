import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import globals from "globals";
import type { Linter } from "eslint";

/**
 * A shared ESLint configuration for the repository.
 * Provides baseline rules for all packages and apps.
 */
export const config: Linter.Config[] = [
  {
    rules: js.configs.recommended.rules,
  },
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    ignores: ["dist/**", "build/**", ".next/**", "out/**", "coverage/**"],
  },
];
