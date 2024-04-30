module.exports = {
  // 设置为true表示该配置文件是根配置文件，ESLint将停止在父目录中查找其他配置文件。
  root: false,
  // 指定脚本运行的环境，可以是浏览器、Node.js或ES6等。这些环境会提供一组预定义的全局变量。
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  /* 配置一些特定的设置，例如React的版本和import配置 */
  settings: {
    react: {
      version: "detect",
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },
  /* 告诉 ESLint 使用您安装的 @typescript-eslint/parser 包来解析源文件。必填的。 */
  parser: "@typescript-eslint/parser",
  /* 配置解析器的选项，例如指定ECMAScript版本、源代码类型和JSX的pragma。 */
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true,
    },
    project: true,
    tsconfigRootDir: __dirname,
  },
  /*  指定要使用的插件，这里使用了React、TypeScript、Prettier插件。 */
  plugins: ["react", "@typescript-eslint", "prettier"],
  /*  扩展现有的规则集，这里使用了一些推荐的规则集 */
  extends: [
    // "plugin:@typescript-eslint/stylistic",
    // "plugin:@typescript-eslint/stylistic-type-checked",
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  /* 配置具体的规则 */
  rules: {
    // react (https://github.com/jsx-eslint/eslint-plugin-react)
    "react-hooks/rules-of-hooks": "error", // 设置为"error"，确保在组件或自定义钩子中调用Hooks。
    "react-hooks/exhaustive-deps": "off", // 设置为"off"，不需要对useEffect和useCallback的依赖项进行详尽检查。
    "react/function-component-definition": "off", // 强制箭头函数定义
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "react/require-default-props": "off", // props默认值
    "react/jsx-props-no-spreading": "off",
    "react/button-has-type": "off",
    "react/jsx-no-constructed-context-values": "off",
    "@typescript-eslint/no-floating-promises": "off", // 禁用必须处理Promise
    "@typescript-eslint/no-explicit-any": "off", // 设置为"off"，允许使用any类型。
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-redundant-type-constituents": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/unbound-method": "off",
    "class-methods-use-this": "off",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/alt-text": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "consistent-return": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["state"] },
    ],
    "no-restricted-syntax": "off",
    // eslint-plugin-import (https://github.com/import-js/eslint-plugin-import)
    "import/no-extraneous-dependencies": "off",
    "import/no-mutable-exports": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "react/no-array-index-key": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    // "import/no-unresolved": "error",
    "import/no-cycle": "error", // 循环依赖
    // import自动排序
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", ["parent", "sibling"]],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  // 忽略
  overrides: [
    {
      files: ["*.js", "*.cjs"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
    },
  ],
};
