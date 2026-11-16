import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        huwiyya: {
          50: "#f6f2fc",
          100: "#ede4f9",
          200: "#dccbf3",
          300: "#c4a7eb",
          400: "#a67de1",
          500: "#8653d4",
          600: "#6e38c3",
          700: "#5826a7",
          800: "#4615a4", // Brand Exact Color
          900: "#361081",
          950: "#1e0750",
          primary: "#4615a4",
          accent: "#5e1ce0",
          dark: "#1c0746",
        },
        wasla: {
          50: "#f6f2fc",
          100: "#ede4f9",
          200: "#dccbf3",
          500: "#8653d4",
          600: "#6e38c3",
          700: "#5826a7",
          800: "#4615a4",
          900: "#361081",
          primary: "#4615a4",
          accent: "#5e1ce0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
