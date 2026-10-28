import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Clean architecture boundaries: inner layers must not import outer ones.
  {
    files: ["src/domain/**/*.ts", "src/application/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", "react", "react-dom", "@prisma/*"],
              message: "Domain and application layers must not depend on frameworks or databases.",
            },
            {
              group: ["@/infrastructure/*", "@/app/*", "@/components/*"],
              message: "Inner layers must not import from outer layers.",
            },
          ],
        },
      ],
    },
  },

  // Domain is the innermost layer: it must not import from application either.
  {
    files: ["src/domain/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "next",
                "next/*",
                "react",
                "react-dom",
                "@prisma/*",
                "@/infrastructure/*",
                "@/app/*",
                "@/components/*",
                "@/application/*",
                "@/presentation/*",
              ],
              message: "Domain must be pure: no framework, database, or outer-layer imports.",
            },
          ],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),
]);

export default eslintConfig;
