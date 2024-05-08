module.exports = {
  root: true,
  extends: ["@cc-devtools/eslint-config"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.js", "*.cjs", "vite.config.ts"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
};
