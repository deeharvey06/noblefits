import client from "./client/eslint.config.mjs";
import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/build/**",
      "**/coverage/**",
      ".husky/**",
    ],
  },
  { ...js.configs.recommended, files: ["*.{js,cjs,mjs}", "scripts/**/*.mjs"] },
  {
    files: ["*.{js,cjs,mjs}", "scripts/**/*.mjs"],
    languageOptions: { globals: globals.node },
  },
  ...client.map((config) => ({ ...config, basePath: "client" })),
  {
    files: ["client/**/*.cjs", "server/**/*.cjs"],
    languageOptions: { sourceType: "commonjs", globals: globals.node },
  },
  {
    ...js.configs.recommended,
    files: ["cypress/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: "readonly",
        Cypress: "readonly",
        expect: "readonly",
      },
    },
  },
  prettier,
];
