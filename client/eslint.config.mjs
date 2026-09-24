import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import prettier from "eslint-config-prettier/flat";

export default [
  {
    ignores: ["build/**", "node_modules/**", "coverage/**"],
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}", "vite.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.flat.recommended.rules,
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["scripts/**/*.js", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.test.{js,jsx}", "src/setupTests.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        test: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
  {
    files: ["src/**/*.{js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^\\.\\.?/(?!.*\\.(?:css|scss)$)",
              message:
                "Use @/ absolute imports; keep colocated stylesheet imports relative.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/**/*.{js,jsx}"],
    ignores: [
      "src/api/**",
      "src/components/stripeButton/PaymentProvider.jsx",
      "src/components/navigation/AppLink.jsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "axios", message: "Use a domain service in @/api." },
            {
              name: "react-router",
              importNames: ["Link", "NavLink"],
              message: "Use the app-owned navigation wrappers.",
            },
          ],
          patterns: [
            {
              regex: "^\\.\\.?/(?!.*\\.(?:css|scss)$)",
              message:
                "Use @/ absolute imports; keep colocated stylesheet imports relative.",
            },
            {
              group: ["firebase", "firebase/*", "@stripe/*", "@/firebase/*"],
              message:
                "Use the API layer or the shared payment wrapper instead of a vendor SDK.",
            },
          ],
        },
      ],
    },
  },
  prettier,
];
