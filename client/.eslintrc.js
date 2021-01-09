module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "prettier/prettier": [
      "warn",
      {
        printWidth: 120,
        tabWidth: 2,
        tabs: false,
        semi: true,
        singleQuote: false,
        trailingComma: "all",
        bracketSpacing: true,
        jsxBracketSameLine: false,
      },
    ],
  },
};
