import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";

const FEATURES = [
  "assignments",
  "auth",
  "companies",
  "dashboard",
  "evaluations",
  "internships",
  "materials",
  "notifications",
  "optimization",
  "participants",
  "reports",
  "staff",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
  {
    plugins: { import: importPlugin },
    rules: {
      // 依存方向の強制: shared → features → app の一方向のみ
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // feature 間の import 禁止（横断は app 層で合成する）
            ...FEATURES.map((feature) => ({
              target: `./src/features/${feature}`,
              from: "./src/features",
              except: [`./${feature}`],
            })),
            // features から app への import 禁止
            { target: "./src/features", from: "./src/app" },
            // shared 層から features / app への import 禁止
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/config",
                "./src/types",
                "./src/stores",
                "./src/i18n",
                "./src/testing",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
