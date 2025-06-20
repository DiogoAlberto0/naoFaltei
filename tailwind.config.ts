import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "*",
    "./node_modules/@heroui/theme/dist/components/(accordion|alert|button|calendar|card|checkbox|chip|date-picker|divider|form|image|input|listbox|modal|navbar|pagination|popover|select|skeleton|toggle|table|toast|ripple|spinner|date-input|scroll-shadow|spacer).js"
  ],
  theme: {
    extend: {
      screens: {
        "h-sm": { raw: "(max-height: 640px)" },
        "max-sm": { raw: "(max-width: 640px)" },
        "max-xs": { raw: "(max-width: 360px)" },
        "max-h-900": { raw: "(max-height: 900px)" },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
