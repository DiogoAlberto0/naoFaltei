import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    rules: {
      // Desabilita a regra que proíbe o uso de 'any'
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["node_modules", ".next", "dist", "out", "public", "coverage"],
  },
];

export default eslintConfig;
