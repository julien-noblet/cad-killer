const babelParser = require("@babel/eslint-parser");
const prettierConfig = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        requireConfigFile: false,
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
];
