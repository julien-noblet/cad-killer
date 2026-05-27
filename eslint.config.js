const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");
const js = require("@eslint/js");
const nextConfig = require("eslint-config-next");

module.exports = [
  {
    ignores: [
      "dist/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  ...nextConfig,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: "19.2.6",
      },
    },
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        __BROWSER_GLOBAL__: "readonly",
        __SERVER_GLOBAL__: "readonly",
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
      "no-underscore-dangle": [
        "error",
        {
          allowAfterThis: true,
          allow: ["_id", "_latlng", "__BROWSER_GLOBAL__", "__SERVER_GLOBAL__"],
        },
      ],
    },
  },
  {
    files: ["setup.js", "teardown.js", "**/*.test.js"],
    rules: {
      "no-console": "off",
    },
  },
  {
    files: ["app/**/*.js"],
    rules: {
      "no-unused-vars": "off",
    },
  },
];
