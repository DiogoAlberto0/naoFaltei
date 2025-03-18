import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*",
    "./node_modules/@heroui/theme/dist/components/(alert|button|calendar|card|chip|divider|form|image|input|listbox|modal|navbar|pagination|skeleton|toggle|table|toast|ripple|spinner|checkbox|spacer).js"
  ],
  theme: {
    extend: {
      screens: { "h-sm": { raw: "(max-height: 640px)" } },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
