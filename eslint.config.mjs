import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  {
    rules: {}
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
