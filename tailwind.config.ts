import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*",
    "./node_modules/@heroui/theme/dist/components/(button|card|divider|form|input|navbar|skeleton|toggle|toast|ripple|spinner).js"
  ],
  theme: {
    extend: {
      screens: { "h-sm": { raw: "(max-height: 640px)" } },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
