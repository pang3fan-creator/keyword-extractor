import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // 项目自定义忽略：文档、规划笔记、agent 沙箱、版本库辅助目录
    ".ccb/**",
    ".claude/**",
    ".worktrees/**",
    "0-Develop_Doc/**",
    "1-suzhen/**",
    "2-gitignore/**",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
