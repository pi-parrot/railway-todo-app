import js from "@eslint/js";
import eslintPluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{js,jsx}"], // JSXファイルを明示的に対象に含める
    ignores: ["node_modules/**", "dist/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          // JSX構文を有効化
          jsx: true,
        },
      },
      // ブラウザやテスト環境で使うグローバル変数を
      // 未定義エラーなく使えるようにする
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        test: "readonly",
        expect: "readonly",
        process: "readonly",
        localStorage: "readonly",
        location: "readonly",
        alert: "readonly",
      },
    },
    plugins: {
      // eslint-plugin-reactプラグインを有効化する
      react: eslintPluginReact,
    },
    rules: {
      // 未使用変数をエラーにする
      "no-unused-vars": "error",
      // JSX内で使われている変数も
      // no-unused-varsの対象として認識する
      "react/jsx-uses-vars": "error",
      /* React 17以降では不要
      'react/jsx-uses-react': 'error',
      'react/react-in-jsx-scope': 'error',
      */
    },
  },
];
